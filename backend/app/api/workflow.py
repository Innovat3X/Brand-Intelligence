from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.models.workflow_run import WorkflowRun
from app.services import brand_service
from app.services.database import get_db
from app.services.llm import (
    AIMLServiceError,
    HTTPAIMLService,
)


router = APIRouter()


ALLOWED_STAGES = {
    "discovery",
    "positioning",
    "shape",
    "visualize",
    "challenge",
    "deliver",
}


AIML_STAGES = {
    "discovery",
    "positioning",
    "shape",
    "visualize",
    "challenge",
}


aiml_service = HTTPAIMLService()


class WorkflowRunRequest(BaseModel):
    stage: str = Field(
        ...,
        min_length=1,
        max_length=50,
    )

    input_data: dict[str, Any] = Field(
        default_factory=dict,
    )


class WorkflowRunResponse(BaseModel):
    id: str
    project_id: str
    stage: str
    status: str
    input_data: dict[str, Any] | None
    output_data: dict[str, Any] | None
    error_message: str | None
    started_at: datetime | None
    completed_at: datetime | None
    created_at: datetime


class WorkflowResultRequest(BaseModel):
    status: str = Field(
        ...,
        pattern="^(completed|failed)$",
    )

    output_data: dict[str, Any] | None = None

    error_message: str | None = None


def _get_project_or_404(
    db: Session,
    project_id: str,
) -> Project:
    project = db.scalar(
        select(Project).where(
            Project.id == project_id
        )
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


def _get_workflow_run_or_404(
    db: Session,
    run_id: str,
) -> WorkflowRun:
    workflow_run = db.scalar(
        select(WorkflowRun).where(
            WorkflowRun.id == run_id
        )
    )

    if workflow_run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow run not found",
        )

    return workflow_run


@router.post(
    "/{project_id}/workflow/run",
    response_model=WorkflowRunResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_workflow_run(
    project_id: str,
    payload: WorkflowRunRequest,
    db: Session = Depends(get_db),
) -> WorkflowRun:
    _get_project_or_404(
        db=db,
        project_id=project_id,
    )

    stage = payload.stage.strip().lower()

    if stage not in ALLOWED_STAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": "Unsupported workflow stage",
                "allowed_stages": sorted(ALLOWED_STAGES),
            },
        )

    now = datetime.now(timezone.utc)

    workflow_run = WorkflowRun(
        project_id=project_id,
        stage=stage,
        status="pending",
        input_data=payload.input_data,
    )

    db.add(workflow_run)
    db.commit()
    db.refresh(workflow_run)

    # Deliver is an assembly/export stage and does not
    # call the AIML service.
    if stage not in AIML_STAGES:
        return workflow_run

    workflow_run.status = "running"
    workflow_run.started_at = now

    db.commit()
    db.refresh(workflow_run)

    brand_state = brand_service.get_brand_state(
        db=db,
        project_id=project_id,
    )

    context: dict[str, Any] = {}

    if brand_state is not None:
        context = dict(
            brand_state.data or {}
        )

    try:
        output_data = await aiml_service.run_stage(
            project_id=project_id,
            stage=stage,
            input_data=payload.input_data,
            context=context,
        )

    except AIMLServiceError as exc:
        completed_at = datetime.now(timezone.utc)

        workflow_run.status = "failed"
        workflow_run.error_message = str(exc)
        workflow_run.completed_at = completed_at

        db.commit()
        db.refresh(workflow_run)

        return workflow_run

    except Exception as exc:
        completed_at = datetime.now(timezone.utc)

        workflow_run.status = "failed"
        workflow_run.error_message = (
            f"Unexpected workflow execution error: {exc}"
        )
        workflow_run.completed_at = completed_at

        db.commit()
        db.refresh(workflow_run)

        return workflow_run

    workflow_run.status = "completed"
    workflow_run.output_data = output_data
    workflow_run.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(workflow_run)

    brand_service.update_stage(
        db=db,
        project_id=project_id,
        stage=stage,
        output_data=output_data,
    )

    db.refresh(workflow_run)

    return workflow_run


@router.get(
    "/{project_id}/workflow",
    response_model=list[WorkflowRunResponse],
)
def list_workflow_runs(
    project_id: str,
    db: Session = Depends(get_db),
) -> list[WorkflowRun]:
    _get_project_or_404(
        db=db,
        project_id=project_id,
    )

    statement = (
        select(WorkflowRun)
        .where(
            WorkflowRun.project_id == project_id
        )
        .order_by(
            WorkflowRun.created_at.asc()
        )
    )

    return list(
        db.scalars(statement).all()
    )


@router.get(
    "/{project_id}/workflow/{run_id}",
    response_model=WorkflowRunResponse,
)
def get_workflow_run(
    project_id: str,
    run_id: str,
    db: Session = Depends(get_db),
) -> WorkflowRun:
    _get_project_or_404(
        db=db,
        project_id=project_id,
    )

    workflow_run = _get_workflow_run_or_404(
        db=db,
        run_id=run_id,
    )

    if workflow_run.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow run not found",
        )

    return workflow_run


@router.post(
    "/{project_id}/workflow/{run_id}/result",
    response_model=WorkflowRunResponse,
)
def submit_workflow_result(
    project_id: str,
    run_id: str,
    payload: WorkflowResultRequest,
    db: Session = Depends(get_db),
) -> WorkflowRun:
    _get_project_or_404(
        db=db,
        project_id=project_id,
    )

    workflow_run = _get_workflow_run_or_404(
        db=db,
        run_id=run_id,
    )

    if workflow_run.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workflow run not found",
        )

    if workflow_run.status in {
        "completed",
        "failed",
    }:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Workflow run has already been finalized",
        )

    now = datetime.now(timezone.utc)

    workflow_run.status = payload.status
    workflow_run.output_data = payload.output_data
    workflow_run.error_message = payload.error_message

    if workflow_run.started_at is None:
        workflow_run.started_at = now

    workflow_run.completed_at = now

    if (
        payload.status == "completed"
        and payload.output_data is not None
    ):
        brand_service.update_stage(
            db=db,
            project_id=project_id,
            stage=workflow_run.stage,
            output_data=payload.output_data,
        )

    db.commit()
    db.refresh(workflow_run)

    return workflow_run