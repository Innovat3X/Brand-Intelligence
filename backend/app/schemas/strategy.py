from pydantic import BaseModel


class StrategyOutput(BaseModel):
    category: str
    target_audience: list[str]
    core_problem: str
    value_proposition: str
    differentiator: str
    positioning_statement: str
    alternatives: list[str]

    personality_traits: list[str]
    personality_rationale: str
    brand_principles: list[str]
    avoid: list[str]