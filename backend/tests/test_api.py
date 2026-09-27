from fastapi.testclient import TestClient


def test_health(client: TestClient):
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"
    assert data["service"] == "Brand Intelligence API"


def test_create_project(client: TestClient):
    response = client.post(
        "/api/projects",
        json={
            "name": "Test Brand",
            "idea": "A platform for independent creators.",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Test Brand"
    assert data["idea"] == "A platform for independent creators."
    assert data["status"] == "created"

    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_project_workflow_and_brand_state(
    client: TestClient,
):
    project_response = client.post(
        "/api/projects",
        json={
            "name": "Workflow Test",
            "idea": "A creator branding platform.",
        },
    )

    assert project_response.status_code == 201

    project_id = project_response.json()["id"]

    workflow_response = client.post(
        f"/api/projects/{project_id}/workflow/run",
        json={
            "stage": "discovery",
            "input_data": {
                "user_message": "Help creators build distinctive brands."
            },
        },
    )

    assert workflow_response.status_code == 201

    run_id = workflow_response.json()["id"]

    assert workflow_response.json()["status"] == "pending"

    result_response = client.post(
        f"/api/projects/{project_id}/workflow/{run_id}/result",
        json={
            "status": "completed",
            "output_data": {
                "summary": "Creators need distinctive branding.",
                "audience": "Independent creators",
            },
        },
    )

    assert result_response.status_code == 200

    assert result_response.json()["status"] == "completed"

    brand_response = client.get(
        f"/api/projects/{project_id}/brand"
    )

    assert brand_response.status_code == 200

    brand_data = brand_response.json()

    assert brand_data["project_id"] == project_id
    assert brand_data["data"]["last_completed_stage"] == "discovery"

    assert (
        brand_data["data"]["stages"]["discovery"]["summary"]
        == "Creators need distinctive branding."
    )


def test_export_project(client: TestClient):
    project_response = client.post(
        "/api/projects",
        json={
            "name": "Export Test",
            "idea": "A brand intelligence product.",
        },
    )

    assert project_response.status_code == 201

    project_id = project_response.json()["id"]

    export_response = client.get(
        f"/api/projects/{project_id}/export"
    )

    assert export_response.status_code == 200

    data = export_response.json()

    assert data["project"]["id"] == project_id
    assert data["brand"] is None
    assert isinstance(data["workflow_history"], list)