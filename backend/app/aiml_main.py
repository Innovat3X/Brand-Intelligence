import os
from typing import Any

from fastapi import FastAPI, HTTPException
from openai import OpenAI
from pydantic import BaseModel, Field

from app.agents.brand_creation import (
    run_shape,
    run_visualize,
)
from app.agents.challenge import run_challenge
from app.agents.discovery import run_discovery
from app.agents.positioning import run_positioning


app = FastAPI(
    title="Brand Intelligence AIML Service",
    version="1.0.0",
)


class AIMLWorkflowRequest(BaseModel):
    project_id: str = ""
    stage: str
    input_data: dict[str, Any] = Field(default_factory=dict)
    context: dict[str, Any] = Field(default_factory=dict)


def get_nvidia_client() -> OpenAI:
    api_key = os.getenv("NVIDIA_API_KEY")

    if not api_key:
        raise RuntimeError(
            "NVIDIA_API_KEY is not configured."
        )

    return OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=api_key,
    )


@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "aiml",
    }


@app.get("/test-model")
async def test_model() -> dict[str, Any]:
    try:
        client = get_nvidia_client()

        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "user",
                    "content": "OK",
                }
            ],
            max_tokens=32,
            stream=False,
        )

        choice = response.choices[0]

        return {
            "status": "ok",
            "model": "openai/gpt-oss-20b",
            "content": choice.message.content,
            "has_reasoning": bool(
                getattr(
                    choice.message,
                    "reasoning_content",
                    None,
                )
            ),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Model test failed: {exc}",
        ) from exc


def extract_user_idea(
    input_data: dict[str, Any],
) -> str:
    possible_values = (
        input_data.get("idea"),
        input_data.get("user_idea"),
        input_data.get("prompt"),
    )

    for value in possible_values:
        if isinstance(value, str) and value.strip():
            return value.strip()

    raise ValueError(
        "Discovery requires a non-empty idea in input_data.idea."
    )


@app.post("/workflow/run")
async def run_workflow(
    request: AIMLWorkflowRequest,
) -> dict[str, Any]:
    stage = request.stage.strip().lower()

    try:
        if stage == "discovery":
            user_idea = extract_user_idea(
                request.input_data
            )

            output = run_discovery(
                user_idea=user_idea
            )

            return {
                "result": output.model_dump()
            }

        if stage == "positioning":
            output = run_positioning(
                input_data=request.input_data,
                context=request.context,
            )

            return {
                "result": output
            }

        if stage == "shape":
            output = run_shape(
                input_data=request.input_data,
                context=request.context,
            )

            return {
                "result": output
            }

        if stage == "visualize":
            output = run_visualize(
                input_data=request.input_data,
                context=request.context,
            )

            return {
                "result": output
            }

        if stage == "challenge":
            output = run_challenge(
                input_data=request.input_data,
                context=request.context,
            )

            return {
                "result": output
            }

        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported AIML stage: {request.stage}. "
                "Supported stages are discovery, positioning, "
                "shape, visualize, and challenge."
            ),
        )

    except HTTPException:
        raise

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"AI workflow execution failed: {exc}",
        ) from exc