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


load_dotenv()


api_key = os.getenv("NVIDIA_API_KEY")

if not api_key:
    raise RuntimeError(
        "NVIDIA_API_KEY is not configured in backend/.env"
    )


client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=api_key,
    timeout=120.0,
    max_retries=0,
)


SYSTEM_PROMPT = """
You are the Challenge Agent in a Brand Intelligence system.

Your job is to stress-test a brand system using the supplied project context.

Look for:
- contradictions
- gaps
- weak assumptions
- risks
- inconsistencies between strategy and execution

Return ONLY a JSON object.

Return exactly this structure:

{
  "summary": "string",
  "issues": [
    {
      "title": "string",
      "description": "string",
      "severity": "low",
      "category": "string",
      "recommendation": "string"
    }
  ],
  "strengths": [
    "string"
  ],
  "recommendations": [
    "string"
  ],
  "consistency": [
    {
      "area": "string",
      "status": "pass",
      "explanation": "string"
    }
  ]
}

Requirements:

- 3 to 5 issues maximum
- 3 strengths maximum
- 3 recommendations maximum
- 4 to 5 consistency checks
- Keep every field concise
- Do not invent statistics, competitors, research, revenue, or traction
- Base observations only on the supplied context
- severity must be low, medium, or high
- status must be pass, warning, or fail
- Do not use markdown
- Do not use ```json fences
- Do not add commentary before or after the JSON
"""


def _compact_context(
    context: dict[str, Any],
) -> dict[str, Any]:
    """
    Reduce the brand context before sending it to the LLM.
    Challenge needs the important decisions from each completed stage.
    """

    stages = context.get("stages", {})

    if not isinstance(stages, dict):
        return {}

    compact: dict[str, Any] = {}

    # ---------------------------------------------------------
    # DISCOVERY
    # ---------------------------------------------------------
    discovery = stages.get("discovery")

    if isinstance(discovery, dict):
        compact["discovery"] = {
            "problem": discovery.get("problem"),
            "target_users": discovery.get("target_users"),
            "user_segments": discovery.get("user_segments"),
            "pain_points": discovery.get("pain_points"),
            "goals": discovery.get("goals"),
            "constraints": discovery.get("constraints"),
        }

    # ---------------------------------------------------------
    # POSITIONING
    # ---------------------------------------------------------
    positioning = stages.get("positioning")

    if isinstance(positioning, dict):
        directions = (
            positioning.get("directions")
            or positioning.get("positioning_directions")
            or positioning.get("options")
        )

        compact_directions: list[dict[str, Any]] = []

        if isinstance(directions, list):
            for direction in directions[:3]:
                if isinstance(direction, dict):
                    compact_directions.append(
                        {
                            "title": direction.get("title"),
                            "description": direction.get("description"),
                            "differentiator": direction.get("differentiator"),
                            "value_proposition": direction.get(
                                "value_proposition"
                            ),
                        }
                    )

        compact["positioning"] = {
            "directions": compact_directions
        }

    # ---------------------------------------------------------
    # SHAPE
    # ---------------------------------------------------------
    shape = stages.get("shape")

    if isinstance(shape, dict):
        personality = shape.get("personality")
        naming = shape.get("naming")
        voice = shape.get("voice")

        compact_shape: dict[str, Any] = {}

        if isinstance(personality, dict):
            compact_shape["personality"] = {
                "traits": personality.get("traits"),
                "avoid_traits": personality.get("avoid_traits"),
            }

        if isinstance(naming, dict):
            options = naming.get("options")

            compact_options: list[dict[str, Any]] = []

            if isinstance(options, list):
                for option in options[:5]:
                    if isinstance(option, dict):
                        compact_options.append(
                            {
                                "name": option.get("name"),
                                "territory": option.get("territory"),
                                "concerns": option.get("concerns"),
                            }
                        )

            compact_shape["naming"] = {
                "options": compact_options
            }

        if isinstance(voice, dict):
            compact_shape["voice"] = {
                "principles": voice.get("principles"),
                "do_examples": voice.get("do_examples"),
                "dont_examples": voice.get("dont_examples"),
            }

        compact["shape"] = compact_shape

    # ---------------------------------------------------------
    # VISUALIZE
    # ---------------------------------------------------------
    visualize = stages.get("visualize")

    if isinstance(visualize, dict):
        compact["visualize"] = {
            "direction": visualize.get("direction"),
            "keywords": visualize.get("keywords"),
            "principles": visualize.get("principles"),
            "colors": visualize.get("colors"),
            "typography": visualize.get("typography"),
        }

    return compact


def _extract_json_object(
    content: str,
) -> dict[str, Any]:
    """
    Safely extract a JSON object from model output.

    Handles:
    - plain JSON
    - ```json ... ``` fences
    - short text surrounding the JSON object
    """

    if not isinstance(content, str):
        raise RuntimeError(
            "Challenge Agent returned a non-string response."
        )

    cleaned = content.strip()

    if not cleaned:
        raise RuntimeError(
            "Challenge Agent returned an empty response."
        )

    # ---------------------------------------------------------
    # Remove markdown opening fence
    # ---------------------------------------------------------
    cleaned = re.sub(
        r"^```(?:json)?\s*",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    # ---------------------------------------------------------
    # Remove markdown closing fence
    # ---------------------------------------------------------
    cleaned = re.sub(
        r"\s*```$",
        "",
        cleaned,
    )

    cleaned = cleaned.strip()

    # ---------------------------------------------------------
    # First attempt: complete response is JSON
    # ---------------------------------------------------------
    try:
        parsed = json.loads(cleaned)

        if isinstance(parsed, dict):
            return parsed

    except json.JSONDecodeError:
        pass

    # ---------------------------------------------------------
    # Second attempt: extract outermost JSON object
    # ---------------------------------------------------------
    first_brace = cleaned.find("{")
    last_brace = cleaned.rfind("}")

    if (
        first_brace >= 0
        and last_brace > first_brace
    ):
        candidate = cleaned[
            first_brace:last_brace + 1
        ]

        try:
            parsed = json.loads(candidate)

            if isinstance(parsed, dict):
                return parsed

        except json.JSONDecodeError:
            pass

    # ---------------------------------------------------------
    # Useful diagnostic
    # ---------------------------------------------------------
    preview = cleaned[:500].replace(
        "\n",
        " ",
    )

    raise RuntimeError(
        "Challenge Agent returned invalid JSON. "
        f"Model response started with: {preview}"
    )


def run_challenge(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
) -> dict[str, Any]:

    # ---------------------------------------------------------
    # Validate project idea
    # ---------------------------------------------------------
    idea = input_data.get("idea")

    if (
        not isinstance(idea, str)
        or not idea.strip()
    ):
        raise ValueError(
            "Challenge requires a non-empty project idea."
        )

    # ---------------------------------------------------------
    # Compact context before sending to the model
    # ---------------------------------------------------------
    compact_context = _compact_context(
        context
    )

    # ---------------------------------------------------------
    # Build user prompt
    # ---------------------------------------------------------
    user_prompt = f"""
PROJECT IDEA:

{idea.strip()}


CURRENT BRAND SYSTEM:

{json.dumps(
    compact_context,
    ensure_ascii=False,
    separators=(",", ":"),
)}


INSTRUCTIONS:

{input_data.get(
    "instructions",
    "Stress-test the current brand system.",
)}


IMPORTANT:

Analyze only the supplied information.

Do not invent:
- statistics
- competitors
- customers
- revenue
- market research
- traction
- user numbers

Return ONLY one valid JSON object.

Do not include:
- markdown
- ```json
- explanations outside the JSON
- introductory text
- concluding text
"""

    # ---------------------------------------------------------
    # NVIDIA request
    # ---------------------------------------------------------
    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
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
            max_tokens=1400,
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
            "The Challenge Agent request timed out."
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
            f"Challenge Agent execution failed: {exc}"
        ) from exc

    # ---------------------------------------------------------
    # Validate response object
    # ---------------------------------------------------------
    if not response.choices:
        raise RuntimeError(
            "Challenge Agent returned no response."
        )

    message = response.choices[0].message

    # ---------------------------------------------------------
    # Get normal content
    # ---------------------------------------------------------
    content = getattr(
        message,
        "content",
        None,
    )

    # ---------------------------------------------------------
    # Some reasoning models can place useful output in
    # reasoning_content instead of content.
    # ---------------------------------------------------------
    if not isinstance(
        content,
        str,
    ) or not content.strip():

        reasoning_content = getattr(
            message,
            "reasoning_content",
            None,
        )

        if (
            isinstance(
                reasoning_content,
                str,
            )
            and reasoning_content.strip()
        ):
            content = reasoning_content

    # ---------------------------------------------------------
    # Final empty-response check
    # ---------------------------------------------------------
    if not isinstance(
        content,
        str,
    ) or not content.strip():

        raise RuntimeError(
            "Challenge Agent returned an empty response."
        )

    # ---------------------------------------------------------
    # Parse JSON
    # ---------------------------------------------------------
    data = _extract_json_object(
        content
    )

    if not isinstance(
        data,
        dict,
    ):
        raise RuntimeError(
            "Challenge Agent returned an invalid JSON object."
        )

    # ---------------------------------------------------------
    # Read fields
    # ---------------------------------------------------------
    summary = data.get(
        "summary",
        "",
    )

    issues = data.get(
        "issues",
        [],
    )

    strengths = data.get(
        "strengths",
        [],
    )

    recommendations = data.get(
        "recommendations",
        [],
    )

    consistency = data.get(
        "consistency",
        [],
    )

    # ---------------------------------------------------------
    # Normalize field types
    # ---------------------------------------------------------
    if not isinstance(
        summary,
        str,
    ):
        summary = str(summary)

    if not isinstance(
        issues,
        list,
    ):
        issues = []

    if not isinstance(
        strengths,
        list,
    ):
        strengths = []

    if not isinstance(
        recommendations,
        list,
    ):
        recommendations = []

    if not isinstance(
        consistency,
        list,
    ):
        consistency = []

    # ---------------------------------------------------------
    # Clean issues
    # ---------------------------------------------------------
    cleaned_issues: list[dict[str, Any]] = []

    for issue in issues[:5]:

        if not isinstance(
            issue,
            dict,
        ):
            continue

        severity = issue.get(
            "severity",
            "medium",
        )

        if severity not in {
            "low",
            "medium",
            "high",
        }:
            severity = "medium"

        cleaned_issues.append(
            {
                "title": str(
                    issue.get(
                        "title",
                        "Brand issue",
                    )
                ),
                "description": str(
                    issue.get(
                        "description",
                        "",
                    )
                ),
                "severity": severity,
                "category": str(
                    issue.get(
                        "category",
                        "general",
                    )
                ),
                "recommendation": str(
                    issue.get(
                        "recommendation",
                        "",
                    )
                ),
            }
        )

    # ---------------------------------------------------------
    # Clean consistency checks
    # ---------------------------------------------------------
    cleaned_consistency: list[dict[str, Any]] = []

    for item in consistency[:5]:

        if not isinstance(
            item,
            dict,
        ):
            continue

        status = item.get(
            "status",
            "warning",
        )

        if status not in {
            "pass",
            "warning",
            "fail",
        }:
            status = "warning"

        cleaned_consistency.append(
            {
                "area": str(
                    item.get(
                        "area",
                        "Brand system",
                    )
                ),
                "status": status,
                "explanation": str(
                    item.get(
                        "explanation",
                        "",
                    )
                ),
            }
        )

    # ---------------------------------------------------------
    # Clean strengths
    # ---------------------------------------------------------
    cleaned_strengths = [
        str(item)
        for item in strengths[:3]
        if item is not None
    ]

    # ---------------------------------------------------------
    # Clean recommendations
    # ---------------------------------------------------------
    cleaned_recommendations = [
        str(item)
        for item in recommendations[:3]
        if item is not None
    ]

    # ---------------------------------------------------------
    # Final result
    # ---------------------------------------------------------
    return {
        "summary": summary,
        "issues": cleaned_issues,
        "strengths": cleaned_strengths,
        "recommendations": cleaned_recommendations,
        "consistency": cleaned_consistency,
    }