from pydantic import BaseModel, Field


class PersonalityOutput(BaseModel):
    traits: list[str] = Field(default_factory=list)
    avoid_traits: list[str] = Field(default_factory=list)
    rationale: dict[str, str] = Field(default_factory=dict)


class NamingOption(BaseModel):
    name: str
    rationale: str | None = None
    territory: str | None = None
    strengths: list[str] = Field(default_factory=list)
    concerns: list[str] = Field(default_factory=list)


class NamingOutput(BaseModel):
    options: list[NamingOption] = Field(default_factory=list)


class VoiceOutput(BaseModel):
    principles: list[str] = Field(default_factory=list)
    do_examples: list[str] = Field(default_factory=list)
    dont_examples: list[str] = Field(default_factory=list)
    sample_messages: list[str] = Field(default_factory=list)


class ShapeOutput(BaseModel):
    personality: PersonalityOutput
    naming: NamingOutput
    voice: VoiceOutput


class ColorSwatch(BaseModel):
    name: str
    hex: str
    role: str | None = None
    rationale: str | None = None


class TypographyChoice(BaseModel):
    name: str
    role: str = "Primary"
    rationale: str | None = None
    style: str | None = None


class VisualOutput(BaseModel):
    direction: str | None = None
    keywords: list[str] = Field(default_factory=list)
    imagery: list[str] = Field(default_factory=list)
    principles: list[str] = Field(default_factory=list)
    colors: list[ColorSwatch] = Field(default_factory=list)
    typography: list[TypographyChoice] = Field(default_factory=list)


class BrandCreationShapeResult(BaseModel):
    stage: str = "shape"
    output: ShapeOutput


class BrandCreationVisualResult(BaseModel):
    stage: str = "visualize"
    output: VisualOutput