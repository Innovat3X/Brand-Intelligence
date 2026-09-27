from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.orm import Session

from app.services import project_service
from app.services.database import get_db


router = APIRouter()


class ProjectCreateRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Human-readable project name",
    )

    idea: str = Field(
        ...,
        min_length=1,
        description="Raw product, startup, community, or creator idea",
    )


class ProjectUpdateRequest(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=200,
    )

    idea: str | None = Field(
        default=None,
        min_length=1,
    )

    status: str | None = Field(
        default=None,
        max_length=50,
    )


class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    idea: str
    status: str
    created_at: datetime
    updated_at: datetime


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    payload: ProjectCreateRequest,
    db: Session = Depends(get_db),
) -> ProjectResponse:
    """
    Create a new Brand Intelligence project.
    """

    return project_service.create_project(
        db=db,
        name=payload.name,
        idea=payload.idea,
    )


@router.get(
    "",
    response_model=list[ProjectResponse],
)
def list_projects(
    db: Session = Depends(get_db),
) -> list[ProjectResponse]:
    """
    Return all projects, newest first.
    """

    return project_service.get_projects(db)


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
) -> ProjectResponse:
    """
    Return a single project by ID.
    """

    project = project_service.get_project(
        db=db,
        project_id=project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: str,
    payload: ProjectUpdateRequest,
    db: Session = Depends(get_db),
) -> ProjectResponse:
    """
    Update project metadata.
    """

    project = project_service.get_project(
        db=db,
        project_id=project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project_service.update_project(
        db=db,
        project=project,
        name=payload.name,
        idea=payload.idea,
        status=payload.status,
    )


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
) -> None:
    """
    Delete a project and its associated workflow/brand state.
    """

    project = project_service.get_project(
        db=db,
        project_id=project_id,
    )

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    project_service.delete_project(
        db=db,
        project=project,
    )