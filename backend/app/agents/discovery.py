import json
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import (
    APIConnectionError,
    APIError,
    APITimeoutError,
    OpenAI,
)

from app.schemas.discovery import DiscoveryOutput


load_dotenv()


NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")

if not NVIDIA_API_KEY:
    raise RuntimeError(
        "NVIDIA_API_KEY is not configured. "
        "Add it to backend/.env before starting the AIML service."
    )


client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=NVIDIA_API_KEY,
    timeout=55.0,
    max_retries=0,
)


PROMPT_PATH = (
    Path(__file__).resolve().parent.parent
    / "prompts"
    / "discovery.txt"
)


with open(
    PROMPT_PATH,
    "r",
    encoding="utf-8",
) as file:
    DISCOVERY_PROMPT = file.read()


def run_discovery(
    user_idea: str,
) -> DiscoveryOutput:

    if not user_idea or not user_idea.strip():
        raise ValueError(
            "Discovery requires a non-empty user idea."
        )

    try:
        response = client.chat.completions.create(
            model="nvidia/nemotron-3.5-lightning-30b-a3b",

            messages=[
                {
                    "role": "system",
                    "content": DISCOVERY_PROMPT,
                },
                {
                    "role": "user",
                    "content": user_idea.strip(),
                },
            ],

            temperature=0.1,
            top_p=0.9,

            max_tokens=800,

            response_format={
                "type": "json_object"
            },

            extra_body={
                "chat_template_kwargs": {
                    "enable_thinking": False
                }
            },

            stream=False,
        )

    except APITimeoutError as exc:
        raise RuntimeError(
            "The Discovery Agent timed out after 55 seconds."
        ) from exc

    except APIConnectionError as exc:
        raise RuntimeError(
            "Could not connect to the NVIDIA AI service."
        ) from exc

    except APIError as exc:
        raise RuntimeError(
            f"The NVIDIA AI service returned an API error: {exc}"
        ) from exc

    except Exception as exc:
        raise RuntimeError(
            f"Discovery Agent execution failed: {exc}"
        ) from exc

    if not response.choices:
        raise RuntimeError(
            "The Discovery Agent returned no response."
        )

    result = response.choices[0].message.content

    if not result:
        raise RuntimeError(
            "The Discovery Agent returned an empty response."
        )

    try:
        data = json.loads(result)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "The Discovery Agent returned invalid JSON."
        ) from exc

    if not isinstance(data, dict):
        raise RuntimeError(
            "The Discovery Agent returned an invalid JSON object."
        )

    normalized_data = {
        key.lower().replace(" ", "_"): value
        for key, value in data.items()
    }

    try:
        return DiscoveryOutput.model_validate(
            normalized_data
        )
    except Exception as exc:
        raise RuntimeError(
            f"Discovery output did not match the required schema: {exc}"
        ) from exc