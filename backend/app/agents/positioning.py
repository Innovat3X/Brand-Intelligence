import json
import os
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

api_key = os.getenv("NVIDIA_API_KEY")

if not api_key:
    raise RuntimeError(
        "NVIDIA_API_KEY is not configured in backend/.env"
    )

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=api_key,
    timeout=45.0,
    max_retries=0,
)


SYSTEM_PROMPT = """
You are a brand positioning agent.

Create exactly 3 distinct positioning directions from the project idea
and discovery context.

Return ONLY valid JSON.

Required structure:

{
  "directions": [
    {
      "id": "direction-1",
      "title": "...",
      "description": "...",
      "rationale": "...",
      "differentiator": "...",
      "value_proposition": "..."
    },
    {
      "id": "direction-2",
      "title": "...",
      "description": "...",
      "rationale": "...",
      "differentiator": "...",
      "value_proposition": "..."
    },
    {
      "id": "direction-3",
      "title": "...",
      "description": "...",
      "rationale": "...",
      "differentiator": "...",
      "value_proposition": "..."
    }
  ]
}

Keep every field concise.

Do not invent statistics, competitors, market research, revenue,
traction, or unsupported facts.

The three directions must be meaningfully different.
"""


def _compact_context(
    context: dict[str, Any],
) -> dict[str, Any]:
    """
    Only send the discovery information needed for positioning.
    Avoid sending the entire accumulated brand state.
    """

    stages = context.get("stages")

    if not isinstance(stages, dict):
        return {}

    discovery = stages.get("discovery")

    if isinstance(discovery, dict):
        return {
            "discovery": discovery
        }

    return {}


def run_positioning(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
) -> dict[str, Any]:

    idea = input_data.get("idea")

    if (
        not isinstance(idea, str)
        or not idea.strip()
    ):
        raise ValueError(
            "Positioning requires a non-empty project idea."
        )

    compact_context = _compact_context(
        context
    )

    user_prompt = f"""
PROJECT IDEA:
{idea.strip()}

DISCOVERY CONTEXT:
{json.dumps(
    compact_context,
    ensure_ascii=False,
)}

ADDITIONAL INSTRUCTIONS:
{input_data.get("instructions", "")}
"""

    response = client.chat.completions.create(
        model="nvidia/nemotron-3.5-lightning-30b-a3b",

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": user_prompt,
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

    if not response.choices:
        raise RuntimeError(
            "Positioning Agent returned no response."
        )

    content = response.choices[0].message.content

    if not content:
        raise RuntimeError(
            "Positioning Agent returned an empty response."
        )

    try:
        data = json.loads(content)
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "Positioning Agent returned invalid JSON."
        ) from exc

    directions = data.get(
        "directions"
    )

    if not isinstance(
        directions,
        list,
    ):
        raise RuntimeError(
            "Positioning Agent did not return directions."
        )

    if len(directions) < 3:
        raise RuntimeError(
            "Positioning Agent returned fewer than 3 directions."
        )

    cleaned = []

    for index in range(3):
        item = directions[index]

        if not isinstance(
            item,
            dict,
        ):
            continue

        cleaned.append(
            {
                "id": f"direction-{index + 1}",

                "title": str(
                    item.get(
                        "title",
                        f"Direction {index + 1}",
                    )
                ),

                "description": str(
                    item.get(
                        "description",
                        "",
                    )
                ),

                "rationale": str(
                    item.get(
                        "rationale",
                        "",
                    )
                ),

                "differentiator": str(
                    item.get(
                        "differentiator",
                        "",
                    )
                ),

                "value_proposition": str(
                    item.get(
                        "value_proposition",
                        "",
                    )
                ),
            }
        )

    if len(cleaned) != 3:
        raise RuntimeError(
            "Positioning Agent produced invalid directions."
        )

    return {
        "directions": cleaned
    }