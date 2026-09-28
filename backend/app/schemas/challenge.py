from pydantic import BaseModel, Field


class BrandIssue(BaseModel):
    title: str
    description: str
    severity: str = "medium"
    category: str | None = None
    recommendation: str | None = None


class ConsistencyItem(BaseModel):
    area: str
    status: str = "warning"
    explanation: str


class ChallengeOutput(BaseModel):
    summary: str | None = None
    issues: list[BrandIssue] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    consistency: list[ConsistencyItem] = Field(default_factory=list)