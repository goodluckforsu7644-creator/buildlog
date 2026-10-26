import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.main import create_app


@pytest.fixture
def client():
    with TestClient(create_app(Settings(_env_file=None, app_env="test"))) as client:
        yield client


def test_health_contains_only_public_status(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "BuildLog"}


def test_health_schema_is_available(client):
    response = client.get("/openapi.json")
    assert "/api/health" in response.json()["paths"]


def test_browser_origin_can_read_health_with_credentials(client):
    response = client.get(
        "/api/health", headers={"Origin": "http://localhost:5173"}
    )
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert response.headers["access-control-allow-credentials"] == "true"


def test_other_origin_is_not_allowed(client):
    response = client.get("/api/health", headers={"Origin": "https://other.example"})
    assert "access-control-allow-origin" not in response.headers


@pytest.mark.parametrize(
    ("origin", "expected"),
    [("http://localhost:5173", 200), ("https://other.example", 400)],
)
def test_preflight_origin(client, origin, expected):
    response = client.options(
        "/api/health",
        headers={"Origin": origin, "Access-Control-Request-Method": "GET"},
    )
    assert response.status_code == expected


@pytest.mark.parametrize("origin", ["*", "http://localhost:5173/", "file://test"])
def test_settings_reject_non_origin_values(origin):
    with pytest.raises(ValidationError):
        Settings(_env_file=None, cors_origins=[origin])


def test_settings_load_backend_env_from_any_working_directory(tmp_path, monkeypatch):
    from app.core import config

    env_file = tmp_path / "test.env"
    env_file.write_text('APP_ENV=test\nCORS_ORIGINS=["http://localhost:9000"]\n')
    monkeypatch.chdir(tmp_path)
    settings = config.Settings(_env_file=env_file)
    assert settings.app_env == "test"
    assert settings.cors_origins == ["http://localhost:9000"]
    assert config.Settings.model_config["env_file"] == config.BACKEND_DIR / ".env"
