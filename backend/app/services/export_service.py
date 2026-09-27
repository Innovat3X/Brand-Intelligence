from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.brand_state import BrandState
from app.models.project import Project
from app.models.workflow_run import WorkflowRun


def build_project_export(
    db: Session,
    project_id: str,
) -> dict[str, Any] | None:
    project = db.scalar(
        select(Project).where(
            Project.id == project_id
        )
    )

    if project is None:
        return None

    brand_state = db.scalar(
        select(BrandState).where(
            BrandState.project_id == project_id
        )
    )

    workflow_runs = list(
        db.scalars(
            select(WorkflowRun)
            .where(
                WorkflowRun.project_id == project_id
            )
            .order_by(
                WorkflowRun.created_at.asc()
            )
        ).all()
    )

    return {
        "project": {
            "id": project.id,
            "name": project.name,
            "idea": project.idea,
            "status": project.status,
            "created_at": project.created_at,
            "updated_at": project.updated_at,
        },
        "brand": (
            {
                "id": brand_state.id,
                "project_id": brand_state.project_id,
                "version": brand_state.version,
                "data": brand_state.data,
                "updated_at": brand_state.updated_at,
            }
            if brand_state
            else None
        ),
        "workflow_history": [
            {
                "id": run.id,
                "stage": run.stage,
                "status": run.status,
                "input_data": run.input_data,
                "output_data": run.output_data,
                "error_message": run.error_message,
                "started_at": run.started_at,
                "completed_at": run.completed_at,
                "created_at": run.created_at,
            }
            for run in workflow_runs
        ],
    }