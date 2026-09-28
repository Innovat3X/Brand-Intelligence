import json
import os
import re
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
    timeout=120.0,
    max_retries=0,
)


SHAPE_SYSTEM_PROMPT = """
You are the Brand Creation Agent in an AI-powered Brand Intelligence system.

Your responsibility during the SHAPE stage is to transform the project idea,
discovery findings, and selected positioning direction into a coherent brand
character.

You are responsible for:
- brand personality
- naming options
- brand voice

Do not perform discovery or strategic positioning yourself.

RULES:
1. Use the supplied context as the primary source.
2. Do not invent unsupported business facts, customers, competitors,
   research, traction, revenue, or market claims.
3. Make reasonable creative decisions where appropriate.
4. Keep personality, naming, and voice coherent with the supplied strategy.
5. Return ONLY a JSON object.
6. Do not use markdown.
7. Do not wrap the JSON in ``` or any other formatting.
8. Do not add explanations before or after the JSON.
9. Do not add extra fields.
10. Keep the response concise.

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

Your responsibility during the VISUALIZE stage is to translate the project
idea, discovery, positioning, and brand shape into a coherent visual identity.

You are responsible for:
- visual direction
- visual keywords
- imagery guidance
- color palette
- typography direction
- design principles

Do not redo discovery or positioning.

RULES:
1. Use the supplied context as the primary source.
2. Keep visual decisions consistent with the supplied strategy and brand shape.
3. Do not invent unsupported business facts or market claims.
4. Every color must contain a valid hexadecimal value.
5. Return ONLY a JSON object.
6. Do not use markdown.
7. Do not wrap the JSON in code fences.
8. Do not add explanations before or after the JSON.
9. Do not add extra fields.
10. Keep every text field short.
11. Generate exactly 5 keywords.
12. Generate exactly 4 imagery items.
13. Generate exactly 4 design principles.
14. Generate exactly 4 colors.
15. Generate exactly 2 typography choices.

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

Return only the JSON object.
"""


def _compact_context(
    context: dict[str, Any],
    *,
    include_shape: bool,
) -> dict[str, Any]:
    stages = context.get("stages")

    if not isinstance(stages, dict):
        return {}

    allowed_stages = [
        "discovery",
        "positioning",
    ]

    if include_shape:
        allowed_stages.append("shape")

    compact: dict[str, Any] = {}

    for stage_name in allowed_stages:
        stage_data = stages.get(stage_name)

        if isinstance(stage_data, dict):
            compact[stage_name] = stage_data

    return compact


def _build_user_prompt(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
    include_shape: bool,
) -> str:
    idea = str(input_data.get("idea", "") or "")
    instructions = str(input_data.get("instructions", "") or "")

    compact_context = _compact_context(
        context,
        include_shape=include_shape,
    )

    return (
        "PROJECT IDEA:\n"
        f"{idea}\n\n"
        "RELEVANT BRAND CONTEXT:\n"
        f"{json.dumps(compact_context, ensure_ascii=False, separators=(',', ':'))}\n\n"
        "STAGE INSTRUCTIONS:\n"
        f"{instructions}\n\n"
        "Return only the requested JSON object."
    )


def _extract_json_object(content: str) -> dict[str, Any]:
    cleaned = content.strip()

    cleaned = re.sub(
        r"^```(?:json)?\s*",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    cleaned = re.sub(
        r"\s*```$",
        "",
        cleaned,
    )

    cleaned = cleaned.strip()

    try:
        parsed = json.loads(cleaned)

        if isinstance(parsed, dict):
            return parsed

    except json.JSONDecodeError:
        pass

    first_brace = cleaned.find("{")
    last_brace = cleaned.rfind("}")

    if first_brace >= 0 and last_brace > first_brace:
        candidate = cleaned[first_brace:last_brace + 1]

        try:
            parsed = json.loads(candidate)

            if isinstance(parsed, dict):
                return parsed

        except json.JSONDecodeError:
            pass

    raise RuntimeError(
        "The Brand Creation Agent returned invalid JSON."
    )


def _call_model(
    *,
    system_prompt: str,
    user_prompt: str,
    max_tokens: int,
) -> dict[str, Any]:
    try:
        response = client.chat.completions.create(
            model="nvidia/nemotron-3.5-lightning-30b-a3b",
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
            temperature=0.1,
            top_p=0.9,
            max_tokens=max_tokens,
            response_format={"type": "json_object"},
            extra_body={
                "chat_template_kwargs": {
                    "enable_thinking": False,
                }
            },
            stream=False,
        )

    except APITimeoutError as exc:
        raise RuntimeError(
            "The NVIDIA AI request timed out after 120 seconds."
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
            f"Brand Creation Agent execution failed: {exc}"
        ) from exc

    if not response.choices:
        raise RuntimeError(
            "The Brand Creation Agent returned no response."
        )

    message = response.choices[0].message
    content = getattr(message, "content", None)

    if not isinstance(content, str) or not content.strip():
        raise RuntimeError(
            "The Brand Creation Agent returned an empty response."
        )

    return _extract_json_object(content)


def run_shape(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
) -> dict[str, Any]:
    user_prompt = _build_user_prompt(
        input_data=input_data,
        context=context,
        include_shape=False,
    )

    data = _call_model(
        system_prompt=SHAPE_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        max_tokens=1400,
    )

    try:
        result = ShapeOutput.model_validate(data)
    except Exception as exc:
        raise RuntimeError(
            f"Shape output did not match the required schema: {exc}"
        ) from exc

    return result.model_dump()


def run_visualize(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
) -> dict[str, Any]:
    user_prompt = _build_user_prompt(
        input_data=input_data,
        context=context,
        include_shape=True,
    )

    data = _call_model(
        system_prompt=VISUAL_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        max_tokens=1000,
    )

    try:
        result = VisualOutput.model_validate(data)
    except Exception as exc:
        raise RuntimeError(
            f"Visual output did not match the required schema: {exc}"
        ) from exc

    return result.model_dump()