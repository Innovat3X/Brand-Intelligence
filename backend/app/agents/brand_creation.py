import json
import os
from typing import Any

from dotenv import load_dotenv
from openai import (
    APIConnectionError,
    APIError,
    APITimeoutError,
    OpenAI,
)

from app.schemas.brand_creation import (
    ShapeOutput,
    VisualOutput,
)


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


SHAPE_SYSTEM_PROMPT = """
You are the Brand Creation Agent in an AI-powered Brand Intelligence system.

Your responsibility during the SHAPE stage is to transform the accumulated
discovery and strategy context into a coherent brand character.

You are responsible for:
- brand personality
- naming options
- brand voice

Do not perform discovery or strategic positioning yourself.
Use the information already present in the supplied brand context.

RULES:
1. Use the supplied context as the primary source.
2. Do not invent unsupported business facts, customers, competitors, traction,
   research, or market claims.
3. Make reasonable creative decisions where appropriate.
4. Keep personality, naming, and voice coherent with the selected strategy.
5. Return ONLY valid JSON.
6. Use exactly the structure requested below.
7. Arrays must contain strings or the specified objects only.
8. Do not add extra fields.
9. Keep the response concise.

OUTPUT FORMAT:

{
  "personality": {
    "traits": ["string"],
    "avoid_traits": ["string"],
    "rationale": {
      "trait": "string"
    }
  },
  "naming": {
    "options": [
      {
        "name": "string",
        "rationale": "string",
        "territory": "string",
        "strengths": ["string"],
        "concerns": ["string"]
      }
    ]
  },
  "voice": {
    "principles": ["string"],
    "do_examples": ["string"],
    "dont_examples": ["string"],
    "sample_messages": ["string"]
  }
}

Generate:
- 4 to 6 personality traits
- 5 naming options
- 4 to 6 voice principles
- 3 do examples
- 3 don't examples
- 3 sample messages
"""


VISUAL_SYSTEM_PROMPT = """
You are the Brand Creation Agent in an AI-powered Brand Intelligence system.

Your responsibility during the VISUALIZE stage is to translate the accumulated
brand strategy, personality, naming, and voice into a coherent visual identity.

You are responsible for:
- visual direction
- visual keywords
- imagery guidance
- color palette
- typography direction
- design principles

Do not redo discovery or positioning.

RULES:
1. Use the supplied brand context as the primary source.
2. Keep visual decisions consistent with the brand personality and strategy.
3. Do not invent unsupported business facts or market claims.
4. Colors must use valid hexadecimal values.
5. Return ONLY valid JSON.
6. Use exactly the structure requested below.
7. Do not add extra fields.
8. Keep the response concise.

OUTPUT FORMAT:

{
  "direction": "string",
  "keywords": ["string"],
  "imagery": ["string"],
  "principles": ["string"],
  "colors": [
    {
      "name": "string",
      "hex": "#000000",
      "role": "string",
      "rationale": "string"
    }
  ],
  "typography": [
    {
      "name": "string",
      "role": "string",
      "rationale": "string",
      "style": "string"
    }
  ]
}

Generate:
- 5 visual keywords
- 4 imagery directions
- 4 design principles
- 4 to 5 colors
- 2 typography choices
"""


def _build_user_prompt(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
) -> str:
    idea = input_data.get("idea", "")
    instructions = input_data.get("instructions", "")

    return (
        "PROJECT IDEA:\n"
        f"{idea}\n\n"
        "ACCUMULATED BRAND CONTEXT:\n"
        f"{json.dumps(context, indent=2, ensure_ascii=False)}\n\n"
        "STAGE INSTRUCTIONS:\n"
        f"{instructions}\n"
    )


def _call_model(
    *,
    system_prompt: str,
    user_prompt: str,
) -> dict[str, Any]:
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            temperature=0.2,
            top_p=0.7,
            max_tokens=1024,
            reasoning_effort="low",
            response_format={"type": "json_object"},
            stream=False,
        )

    except APITimeoutError as exc:
        raise RuntimeError(
            "The NVIDIA AI request timed out after 55 seconds."
        ) from exc

    except APIConnectionError as exc:
        raise RuntimeError(
            "Could not connect to the NVIDIA AI service."
        ) from exc

    except APIError as exc:
        raise RuntimeError(
            f"The NVIDIA AI service returned an API error: {exc}"
        ) from exc

    content = response.choices[0].message.content

    if not content:
        raise ValueError(
            "The Brand Creation Agent returned an empty response."
        )

    try:
        data = json.loads(content)
    except json.JSONDecodeError as exc:
        raise ValueError(
            "The Brand Creation Agent returned invalid JSON."
        ) from exc

    if not isinstance(data, dict):
        raise ValueError(
            "The Brand Creation Agent returned an invalid JSON object."
        )

    return data


def run_shape(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
) -> dict[str, Any]:
    user_prompt = _build_user_prompt(
        input_data=input_data,
        context=context,
    )

    data = _call_model(
        system_prompt=SHAPE_SYSTEM_PROMPT,
        user_prompt=user_prompt,
    )

    result = ShapeOutput.model_validate(data)

    return result.model_dump()


def run_visualize(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
) -> dict[str, Any]:
    user_prompt = _build_user_prompt(
        input_data=input_data,
        context=context,
    )

    data = _call_model(
        system_prompt=VISUAL_SYSTEM_PROMPT,
        user_prompt=user_prompt,
    )

    result = VisualOutput.model_validate(data)

    return result.model_dump()