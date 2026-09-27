from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.brand_state import BrandState


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def get_brand_state(
    db: Session,
    project_id: str,
) -> BrandState | None:
    return db.scalar(
        select(BrandState).where(
            BrandState.project_id == project_id
        )
    )


def update_stage(
    db: Session,
    project_id: str,
    stage: str,
    output_data: dict[str, Any],
) -> BrandState:
    brand_state = get_brand_state(
        db=db,
        project_id=project_id,
    )

    if brand_state is None:
        brand_state = BrandState(
            project_id=project_id,
            version=1,
            data={},
        )

        db.add(brand_state)
        db.flush()

    current_data = dict(brand_state.data or {})

    stages = dict(
        current_data.get("stages", {})
    )

    stages[stage] = output_data

    current_data["stages"] = stages
    current_data["last_completed_stage"] = stage
    current_data["updated_at"] = utc_now().isoformat()

    brand_state.data = current_data
    brand_state.version += 1
    brand_state.updated_at = utc_now()

    db.commit()
    db.refresh(brand_state)

    return brand_state


def replace_brand_state(
    db: Session,
    project_id: str,
    data: dict[str, Any],
) -> BrandState:
    brand_state = get_brand_state(
        db=db,
        project_id=project_id,
    )

    if brand_state is None:
        brand_state = BrandState(
            project_id=project_id,
            version=1,
            data=data,
        )

        db.add(brand_state)
    else:
        brand_state.data = data
        brand_state.version += 1
        brand_state.updated_at = utc_now()

    db.commit()
    db.refresh(brand_state)

    return brand_state