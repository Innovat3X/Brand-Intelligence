from abc import ABC, abstractmethod
from typing import Any

import httpx

from app.config import settings


class AIMLServiceError(Exception):
    """Raised when communication with the AIML service fails."""


class AIMLService(ABC):
    """
    Interface between the backend and the AIML workflow.

    The backend does not know which model, agent framework, or
    orchestration library is used by the AIML implementation.
    """

    @abstractmethod
    async def run_stage(
        self,
        *,
        project_id: str,
        stage: str,
        input_data: dict[str, Any],
        context: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Execute one AI workflow stage.
        """
        raise NotImplementedError


class HTTPAIMLService(AIMLService):
    """
    HTTP adapter for a separately running AIML service.

    This keeps the backend independent from the AI implementation.
    """

    def __init__(
        self,
        base_url: str | None = None,
        timeout: float | None = None,
    ) -> None:
        self.base_url = (
            base_url or settings.aiml_service_url
        ).rstrip("/")

        self.timeout = (
            timeout or settings.aiml_service_timeout
        )

    async def run_stage(
        self,
        *,
        project_id: str,
        stage: str,
        input_data: dict[str, Any],
        context: dict[str, Any],
    ) -> dict[str, Any]:
        payload = {
            "project_id": project_id,
            "stage": stage,
            "input_data": input_data,
            "context": context,
        }

        url = f"{self.base_url}/workflow/run"

        try:
            async with httpx.AsyncClient(
                timeout=self.timeout
            ) as client:
                response = await client.post(
                    url,
                    json=payload,
                )

        except httpx.RequestError as exc:
            raise AIMLServiceError(
                f"Unable to connect to AIML service: {exc}"
            ) from exc

        if response.status_code >= 400:
            raise AIMLServiceError(
                "AIML service returned "
                f"{response.status_code}: {response.text}"
            )

        try:
            result = response.json()
        except ValueError as exc:
            raise AIMLServiceError(
                "AIML service returned invalid JSON"
            ) from exc

        if not isinstance(result, dict):
            raise AIMLServiceError(
                "AIML service response must be a JSON object"
            )

        return result