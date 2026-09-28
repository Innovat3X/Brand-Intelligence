import json
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

from app.schemas.discovery import DiscoveryOutput


load_dotenv()


client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY"),
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

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
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
        response_format={
            "type": "json_object"
        },
    )

    result = (
        response.choices[0]
        .message
        .content
    )

    if not result:
        raise ValueError(
            "The Discovery Agent returned an empty response."
        )

    try:
        data = json.loads(result)
    except json.JSONDecodeError as exc:
        raise ValueError(
            "The Discovery Agent returned invalid JSON."
        ) from exc

    normalized_data = {
        key.lower().replace(" ", "_"): value
        for key, value in data.items()
    }

    return DiscoveryOutput.model_validate(
        normalized_data
    )