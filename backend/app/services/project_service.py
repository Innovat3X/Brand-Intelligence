from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project


def create_project(
    db: Session,
    name: str,
    idea: str,
) -> Project:
    project = Project(
        name=name,
        idea=idea,
        status="created",
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def get_project(
    db: Session,
    project_id: str,
) -> Project | None:
    statement = select(Project).where(Project.id == project_id)

    return db.scalar(statement)


def get_projects(
    db: Session,
) -> list[Project]:
    statement = select(Project).order_by(Project.created_at.desc())

    return list(db.scalars(statement).all())


def update_project(
    db: Session,
    project: Project,
    name: str | None = None,
    idea: str | None = None,
    status: str | None = None,
) -> Project:
    if name is not None:
        project.name = name

    if idea is not None:
        project.idea = idea

    if status is not None:
        project.status = status

    db.commit()
    db.refresh(project)

    return project


def delete_project(
    db: Session,
    project: Project,
) -> None:
    db.delete(project)
    db.commit()