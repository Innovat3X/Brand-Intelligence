from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.brand import router as brand_router
from app.api.export import router as export_router
from app.api.projects import router as projects_router
from app.api.workflow import router as workflow_router
from app.config import settings
from app.models import BrandState, Project, WorkflowRun
from app.services.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifecycle.
    """

    Base.metadata.create_all(bind=engine)

    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Backend API for Brand Intelligence. "
        "Provides project management, workflow execution, "
        "brand state persistence, export, and AI integration."
    ),
    lifespan=lifespan,
)


# ------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------
# Preserve origins configured through the backend settings while
# explicitly allowing the deployed Vercel frontend.
configured_origins = list(
    settings.cors_origins_list
)

required_origins = [
    "https://brand-intelligence-xi.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

allowed_origins = list(
    dict.fromkeys(
        configured_origins + required_origins
    )
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    tags=["system"],
)
def root() -> dict[str, str]:
    return {
        "status": "ok",
        "service": settings.app_name,
        "message": "Brand Intelligence backend is running",
    }


@app.get(
    "/health",
    tags=["system"],
)
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
    }


app.include_router(
    projects_router,
    prefix=f"{settings.api_prefix}/projects",
    tags=["projects"],
)

app.include_router(
    workflow_router,
    prefix=f"{settings.api_prefix}/projects",
    tags=["workflow"],
)

app.include_router(
    brand_router,
    prefix=f"{settings.api_prefix}/projects",
    tags=["brand"],
)

app.include_router(
    export_router,
    prefix=f"{settings.api_prefix}/projects",
    tags=["export"],
)