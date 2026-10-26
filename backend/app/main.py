from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.config import Settings, get_settings


class HealthResponse(BaseModel):
    status: str
    service: str


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    application = FastAPI(title="BuildLog API", version="0.1.0")
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET"],
        allow_headers=["Content-Type"],
    )

    @application.get("/api/health", response_model=HealthResponse, tags=["health"])
    def health() -> HealthResponse:
        # Process health only. No DB connection or configuration is exposed.
        return HealthResponse(status="ok", service="BuildLog")

    return application


app = create_app()
