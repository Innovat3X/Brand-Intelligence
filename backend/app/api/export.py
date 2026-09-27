from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.services.database import get_db
from app.services.export_service import build_project_export


router = APIRouter()


@router.get(
    "/{project_id}/export",
)
def export_project(
    project_id: str,
    db: Session = Depends(get_db),
) -> dict[str, Any]:
    """
    Return the complete project package.

    Includes:
    - project metadata
    - current brand state
    - complete workflow history
    """

    export_data = build_project_export(
        db=db,
        project_id=project_id,
    )

    if export_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return export_data