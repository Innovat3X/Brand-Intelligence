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
    timeout=40.0,
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

Return ONLY valid JSON.

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
"""


def _compact_context(
    context: dict[str, Any],
) -> dict[str, Any]:
    """
    Reduce the brand context substantially before sending
    it to the LLM. Challenge only needs the important
    decisions from each completed stage.
    """

    stages = context.get(
        "stages",
        {},
    )

    if not isinstance(
        stages,
        dict,
    ):
        return {}


    compact: dict[str, Any] = {}


    discovery = stages.get(
        "discovery"
    )

    if isinstance(
        discovery,
        dict,
    ):
        compact["discovery"] = {
            "problem":
                discovery.get("problem"),

            "target_users":
                discovery.get("target_users"),

            "user_segments":
                discovery.get("user_segments"),

            "pain_points":
                discovery.get("pain_points"),

            "goals":
                discovery.get("goals"),

            "constraints":
                discovery.get("constraints"),
        }


    positioning = stages.get(
        "positioning"
    )

    if isinstance(
        positioning,
        dict,
    ):
        directions = (
            positioning.get(
                "directions"
            )
            or positioning.get(
                "positioning_directions"
            )
            or positioning.get(
                "options"
            )
        )

        compact_directions = []

        if isinstance(
            directions,
            list,
        ):
            for direction in directions[:3]:
                if isinstance(
                    direction,
                    dict,
                ):
                    compact_directions.append(
                        {
                            "title":
                                direction.get(
                                    "title"
                                ),

                            "description":
                                direction.get(
                                    "description"
                                ),

                            "differentiator":
                                direction.get(
                                    "differentiator"
                                ),

                            "value_proposition":
                                direction.get(
                                    "value_proposition"
                                ),
                        }
                    )

        compact["positioning"] = {
            "directions":
                compact_directions
        }


    shape = stages.get(
        "shape"
    )

    if isinstance(
        shape,
        dict,
    ):
        personality = shape.get(
            "personality"
        )

        naming = shape.get(
            "naming"
        )

        voice = shape.get(
            "voice"
        )

        compact_shape: dict[str, Any] = {}


        if isinstance(
            personality,
            dict,
        ):
            compact_shape[
                "personality"
            ] = {
                "traits":
                    personality.get(
                        "traits"
                    ),

                "avoid_traits":
                    personality.get(
                        "avoid_traits"
                    ),
            }


        if isinstance(
            naming,
            dict,
        ):
            options = naming.get(
                "options"
            )

            compact_options = []

            if isinstance(
                options,
                list,
            ):
                for option in options[:5]:
                    if isinstance(
                        option,
                        dict,
                    ):
                        compact_options.append(
                            {
                                "name":
                                    option.get(
                                        "name"
                                    ),

                                "territory":
                                    option.get(
                                        "territory"
                                    ),

                                "concerns":
                                    option.get(
                                        "concerns"
                                    ),
                            }
                        )

            compact_shape[
                "naming"
            ] = {
                "options":
                    compact_options
            }


        if isinstance(
            voice,
            dict,
        ):
            compact_shape[
                "voice"
            ] = {
                "principles":
                    voice.get(
                        "principles"
                    ),

                "do_examples":
                    voice.get(
                        "do_examples"
                    ),

                "dont_examples":
                    voice.get(
                        "dont_examples"
                    ),
            }


        compact["shape"] = (
            compact_shape
        )


    visualize = stages.get(
        "visualize"
    )

    if isinstance(
        visualize,
        dict,
    ):
        compact["visualize"] = {
            "direction":
                visualize.get(
                    "direction"
                ),

            "keywords":
                visualize.get(
                    "keywords"
                ),

            "principles":
                visualize.get(
                    "principles"
                ),

            "colors":
                visualize.get(
                    "colors"
                ),

            "typography":
                visualize.get(
                    "typography"
                ),
        }


    return compact


def run_challenge(
    *,
    input_data: dict[str, Any],
    context: dict[str, Any],
) -> dict[str, Any]:

    idea = input_data.get(
        "idea"
    )

    if (
        not isinstance(
            idea,
            str,
        )
        or not idea.strip()
    ):
        raise ValueError(
            "Challenge requires a non-empty project idea."
        )


    compact_context = (
        _compact_context(
            context
        )
    )


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

        max_tokens=1000,

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
            "Challenge Agent returned no response."
        )


    content = (
        response
        .choices[0]
        .message
        .content
    )


    if not content:
        raise RuntimeError(
            "Challenge Agent returned an empty response."
        )


    try:
        data = json.loads(
            content
        )

    except json.JSONDecodeError as exc:
        raise RuntimeError(
            "Challenge Agent returned invalid JSON."
        ) from exc


    if not isinstance(
        data,
        dict,
    ):
        raise RuntimeError(
            "Challenge Agent returned an invalid JSON object."
        )


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


    if not isinstance(
        summary,
        str,
    ):
        summary = str(
            summary
        )


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


    cleaned_issues = []

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


    cleaned_consistency = []

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


    cleaned_strengths = [
        str(item)
        for item in strengths[:3]
        if item is not None
    ]


    cleaned_recommendations = [
        str(item)
        for item in recommendations[:3]
        if item is not None
    ]


    return {
        "summary":
            summary,

        "issues":
            cleaned_issues,

        "strengths":
            cleaned_strengths,

        "recommendations":
            cleaned_recommendations,

        "consistency":
            cleaned_consistency,
    }