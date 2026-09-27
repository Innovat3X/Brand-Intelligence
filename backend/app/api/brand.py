from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.brand_state import BrandState
from app.models.project import Project
from app.services import brand_service
from app.services.database import get_db


router = APIRouter()


class BrandStateUpdateRequest(BaseModel):
    data: dict[str, Any] = Field(
        default_factory=dict,
    )


class BrandStateResponse(BaseModel):
    id: str
    project_id: str
    version: int
    data: dict[str, Any]
    updated_at: str


def get_project_or_404(
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


def serialize_brand_state(
    brand_state: BrandState,
) -> BrandStateResponse:
    return BrandStateResponse(
        id=brand_state.id,
        project_id=brand_state.project_id,
        version=brand_state.version,
        data=brand_state.data,
        updated_at=brand_state.updated_at.isoformat(),
    )


@router.get(
    "/{project_id}/brand",
    response_model=BrandStateResponse,
)
def get_brand(
    project_id: str,
    db: Session = Depends(get_db),
) -> BrandStateResponse:
    get_project_or_404(
        db=db,
        project_id=project_id,
    )

    brand_state = brand_service.get_brand_state(
        db=db,
        project_id=project_id,
    )

    if brand_state is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Brand state not found",
        )

    return serialize_brand_state(brand_state)


@router.put(
    "/{project_id}/brand",
    response_model=BrandStateResponse,
)
def update_brand(
    project_id: str,
    payload: BrandStateUpdateRequest,
    db: Session = Depends(get_db),
) -> BrandStateResponse:
    get_project_or_404(
        db=db,
        project_id=project_id,
    )

    brand_state = brand_service.replace_brand_state(
        db=db,
        project_id=project_id,
        data=payload.data,
    )

    return serialize_brand_state(brand_state)