from pydantic import BaseModel


class DiscoveryOutput(BaseModel):
    problem: str
    target_users: list[str]
    user_segments: list[str]
    pain_points: list[str]
    context: str
    goals: list[str]
    constraints: list[str]
    assumptions: list[str]
    open_questions: list[str]