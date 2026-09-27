"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { ColorPalette } from "../../../../components/visualize/ColorPalette";
import type { ColorSwatch } from "../../../../components/visualize/ColorPalette";

import { TypographyCard } from "../../../../components/visualize/TypographyCard";
import type { TypographyChoice } from "../../../../components/visualize/TypographyCard";

import { VisualBoard } from "../../../../components/visualize/VisualBoard";

import { useBrandKit } from "../../../../hooks/useBrandKit";
import { useProject } from "../../../../hooks/useProject";
import { useWorkflow } from "../../../../hooks/useWorkflow";

import {
    buildStageInput,
    getStageData,
    isRecord,
} from "../../../../lib/brand";

function readString(
    value: unknown,
): string | undefined {
    if (
        typeof value === "string" &&
        value.trim().length > 0
    ) {
        return value.trim();
    }

    return undefined;
}

function readStrings(
    value: unknown,
): string[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(
        (item): item is string =>
            typeof item === "string" &&
            item.trim().length > 0,
    );
}

function normalizeColors(
    value: unknown,
): ColorSwatch[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(isRecord)
        .map(
            (
                item,
                index,
            ): ColorSwatch => ({
                name:
                    readString(item.name) ??
                    `Color ${index + 1}`,

                hex:
                    readString(item.hex) ??
                    readString(item.value) ??
                    "#000000",

                role: readString(
                    item.role,
                ),

                rationale: readString(
                    item.rationale,
                ),
            }),
        );
}

function normalizeTypography(
    value: unknown,
): TypographyChoice[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(isRecord)
        .map(
            (
                item,
                index,
            ): TypographyChoice => ({
                name:
                    readString(item.name) ??
                    readString(item.font) ??
                    `Typography ${index + 1}`,

                role:
                    readString(item.role) ??
                    "Primary",

                rationale: readString(
                    item.rationale,
                ),

                style: readString(
                    item.style,
                ),
            }),
        );
}

function normalizeVisualData(
    value: unknown,
) {
    if (!isRecord(value)) {
        return {
            direction: undefined as
                | string
                | undefined,

            keywords: [] as string[],
            imagery: [] as string[],
            principles: [] as string[],
            colors: [] as ColorSwatch[],
            typography:
                [] as TypographyChoice[],
        };
    }

    const visual = isRecord(
        value.visual,
    )
        ? value.visual
        : value;

    const principlesPrimary =
        readStrings(
            visual.principles,
        );

    const principles =
        principlesPrimary.length > 0
            ? principlesPrimary
            : readStrings(
                visual.design_principles,
            );

    return {
        direction:
            readString(
                visual.direction,
            ) ??
            readString(
                visual.visual_direction,
            ),

        keywords: readStrings(
            visual.keywords,
        ),

        imagery: readStrings(
            visual.imagery,
        ),

        principles,

        colors: normalizeColors(
            visual.colors,
        ),

        typography:
            normalizeTypography(
                visual.typography,
            ),
    };
}

const workflowStages = [
    {
        number: "01",
        title: "Discover",
        description: "Understand the opportunity",
        active: false,
    },
    {
        number: "02",
        title: "Position",
        description: "Choose the strategic direction",
        active: false,
    },
    {
        number: "03",
        title: "Shape",
        description: "Build the brand expression",
        active: false,
    },
    {
        number: "04",
        title: "Visualize",
        description: "Explore the visual identity",
        active: true,
    },
    {
        number: "05",
        title: "Challenge",
        description: "Stress-test the decisions",
        active: false,
    },
    {
        number: "06",
        title: "Deliver",
        description: "Assemble the final system",
        active: false,
    },
];

export default function VisualizePage() {
    const router = useRouter();

    const params = useParams<{
        id?: string;
    }>();

    const projectId =
        params?.id ?? null;

    const {
        project,
        loading: projectLoading,
        error: projectError,
    } = useProject(projectId);

    const {
        brand,
        loading: brandLoading,
        error: brandError,
    } = useBrandKit(projectId);

    const {
        startStage,
        latestRun,
        submitting,
        error: workflowError,
    } = useWorkflow(projectId);

    const visualizeRun =
        latestRun("visualize");

    const visualizeData =
        getStageData(
            brand?.data,
            "visualize",
        );

    const normalized = useMemo(
        () =>
            normalizeVisualData(
                visualizeData,
            ),
        [visualizeData],
    );

    const handleGenerate =
        async () => {
            if (!project) {
                return;
            }

            await startStage(
                "visualize",
                buildStageInput(
                    project.idea,
                    brand?.data,
                    {},
                    "Translate the accumulated brand strategy, personality, naming, and voice into a coherent visual identity. Define the visual direction, keywords, imagery, color palette, typography, and design principles. Explain how the visual system reinforces the brand strategy.",
                ),
            );
        };

    if (
        projectLoading ||
        brandLoading
    ) {
        return (
            <main>
                <div className="site-container">
                    <header className="site-header">
                        <div className="brand-lockup">
                            <span
                                className="brand-mark"
                                aria-hidden="true"
                            >
                                <span />
                                <span />
                                <span />
                                <span />
                            </span>

                            <span>
                                <strong>
                                    Brand Intelligence
                                </strong>

                                <small className="muted">
                                    Connected brand thinking
                                </small>
                            </span>
                        </div>

                        <span className="muted small">
                            Stage 04
                        </span>
                    </header>

                    <section
                        className="surface"
                        style={{
                            maxWidth:
                                "860px",
                            minHeight:
                                "420px",
                            margin:
                                "56px auto 80px",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            textAlign:
                                "center",
                        }}
                    >
                        <div
                            className="stack"
                            style={{
                                alignItems:
                                    "center",
                                maxWidth:
                                    "560px",
                            }}
                        >
                            <span className="eyebrow">
                                Stage 04 · Visualize
                            </span>

                            <div
                                aria-hidden="true"
                                style={{
                                    width:
                                        "58px",
                                    height:
                                        "58px",
                                    margin:
                                        "8px 0",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "var(--bg)",
                                    boxShadow:
                                        "var(--inset-shadow)",
                                }}
                            />

                            <h1>
                                Loading visual identity
                            </h1>

                            <p className="muted">
                                Restoring the brand context
                                before developing the visual
                                system.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    if (!project) {
        return (
            <main>
                <div className="site-container">
                    <header className="site-header">
                        <div className="brand-lockup">
                            <span
                                className="brand-mark"
                                aria-hidden="true"
                            >
                                <span />
                                <span />
                                <span />
                                <span />
                            </span>

                            <span>
                                <strong>
                                    Brand Intelligence
                                </strong>

                                <small className="muted">
                                    Connected brand thinking
                                </small>
                            </span>
                        </div>
                    </header>

                    <section
                        className="surface"
                        style={{
                            maxWidth:
                                "760px",
                            margin:
                                "56px auto 80px",
                            padding:
                                "42px 32px",
                            textAlign:
                                "center",
                        }}
                    >
                        <div
                            className="stack"
                            style={{
                                alignItems:
                                    "center",
                            }}
                        >
                            <span className="eyebrow">
                                Project unavailable
                            </span>

                            <h1>
                                We could not load this
                                project.
                            </h1>

                            <p className="muted">
                                {projectError ??
                                    "The requested project could not be found."}
                            </p>

                            <button
                                type="button"
                                className="button primary"
                                onClick={() =>
                                    router.push(
                                        "/",
                                    )
                                }
                            >
                                Back to home
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    const isRunning =
        submitting ||
        visualizeRun?.status ===
        "pending" ||
        visualizeRun?.status ===
        "running";

    const hasResult =
        Boolean(
            normalized.direction,
        ) ||
        normalized.keywords.length >
        0 ||
        normalized.imagery.length >
        0 ||
        normalized.principles.length >
        0 ||
        normalized.colors.length >
        0 ||
        normalized.typography.length >
        0;

    return (
        <main>
            <div className="site-container">
                <header className="site-header">
                    <div className="brand-lockup">
                        <span
                            className="brand-mark"
                            aria-hidden="true"
                        >
                            <span />
                            <span />
                            <span />
                            <span />
                        </span>

                        <span>
                            <strong>
                                Brand Intelligence
                            </strong>

                            <small className="muted">
                                Connected brand thinking
                            </small>
                        </span>
                    </div>

                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "12px",
                        }}
                    >
                        <span className="muted small">
                            {project.name}
                        </span>

                        <button
                            type="button"
                            className="button compact"
                            onClick={() =>
                                router.push(
                                    `/project/${encodeURIComponent(
                                        project.id,
                                    )}/shape`,
                                )
                            }
                        >
                            Back
                        </button>
                    </div>
                </header>

                <section
                    style={{
                        padding:
                            "52px 0 34px",
                    }}
                >
                    <div
                        style={{
                            display:
                                "grid",
                            gridTemplateColumns:
                                "minmax(0, 1.35fr) minmax(260px, 0.65fr)",
                            gap:
                                "34px",
                            alignItems:
                                "start",
                        }}
                    >
                        <div>
                            <span className="eyebrow">
                                Stage 04 · Visualize
                            </span>

                            <h1
                                style={{
                                    maxWidth:
                                        "850px",
                                    fontSize:
                                        "clamp(2.6rem, 5.2vw, 4.7rem)",
                                    lineHeight:
                                        1.04,
                                    letterSpacing:
                                        "-0.055em",
                                }}
                            >
                                Build the visual
                                identity.
                            </h1>

                            <p
                                className="muted"
                                style={{
                                    maxWidth:
                                        "700px",
                                    marginTop:
                                        "24px",
                                    fontSize:
                                        "1rem",
                                    lineHeight:
                                        1.75,
                                }}
                            >
                                Translate the strategy into
                                a visual system that feels
                                coherent, distinctive, and
                                useful beyond a single
                                mockup.
                            </p>
                        </div>

                        <aside
                            className="surface"
                            style={{
                                padding:
                                    "24px",
                            }}
                        >
                            <span className="eyebrow">
                                Working principle
                            </span>

                            <strong
                                style={{
                                    display:
                                        "block",
                                    fontSize:
                                        "1.05rem",
                                    lineHeight:
                                        1.5,
                                }}
                            >
                                Make the visual system
                                reinforce the strategy.
                            </strong>

                            <p
                                className="muted small"
                                style={{
                                    marginTop:
                                        "10px",
                                    lineHeight:
                                        1.6,
                                }}
                            >
                                Visual decisions should
                                express the personality and
                                positioning already
                                established.
                            </p>
                        </aside>
                    </div>

                    <div
                        className="surface"
                        style={{
                            marginTop:
                                "34px",
                            padding:
                                "18px 20px",
                            overflowX:
                                "auto",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "repeat(6, minmax(145px, 1fr))",
                                minWidth:
                                    "880px",
                                gap:
                                    "10px",
                            }}
                        >
                            {workflowStages.map(
                                (stage) => (
                                    <div
                                        key={
                                            stage.number
                                        }
                                        style={{
                                            padding:
                                                "12px 10px",
                                            borderRadius:
                                                "12px",
                                            background:
                                                "var(--bg)",
                                            boxShadow:
                                                stage.active
                                                    ? "var(--inset-shadow)"
                                                    : "none",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap:
                                                    "10px",
                                            }}
                                        >
                                            <span
                                                className="preview-number"
                                                style={{
                                                    width:
                                                        "30px",
                                                    height:
                                                        "30px",
                                                    boxShadow:
                                                        stage.active
                                                            ? "var(--small-shadow)"
                                                            : "var(--inset-shadow)",
                                                }}
                                            >
                                                {
                                                    stage.number
                                                }
                                            </span>

                                            <strong
                                                style={{
                                                    fontSize:
                                                        "0.8rem",
                                                }}
                                            >
                                                {
                                                    stage.title
                                                }
                                            </strong>
                                        </div>

                                        <p
                                            className="muted"
                                            style={{
                                                marginTop:
                                                    "9px",
                                                fontSize:
                                                    "0.68rem",
                                                lineHeight:
                                                    1.45,
                                            }}
                                        >
                                            {
                                                stage.description
                                            }
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </section>

                {workflowError ||
                    brandError ? (
                    <div
                        className="notice error-notice"
                        role="alert"
                        style={{
                            marginBottom:
                                "30px",
                        }}
                    >
                        <div>
                            <strong>
                                We could not complete that
                                step.
                            </strong>

                            <p>
                                {workflowError ??
                                    brandError}
                            </p>
                        </div>
                    </div>
                ) : null}

                {!hasResult ? (
                    <section
                        className="surface"
                        style={{
                            marginBottom:
                                "80px",
                            padding:
                                "42px",
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "flex-start",
                                justifyContent:
                                    "space-between",
                                gap:
                                    "30px",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth:
                                        "720px",
                                }}
                            >
                                <span className="eyebrow">
                                    Visual system
                                </span>

                                <h2>
                                    Translate the brand into
                                    design.
                                </h2>

                                <p
                                    className="muted"
                                    style={{
                                        marginTop:
                                            "10px",
                                        lineHeight:
                                            1.7,
                                    }}
                                >
                                    Generate a visual
                                    direction, color system,
                                    typography direction,
                                    imagery guidance, and
                                    design principles from
                                    the accumulated brand
                                    context.
                                </p>
                            </div>

                            <span
                                className="preview-number"
                                style={{
                                    width:
                                        "48px",
                                    height:
                                        "48px",
                                    flexShrink:
                                        0,
                                    boxShadow:
                                        "var(--small-shadow)",
                                }}
                            >
                                04
                            </span>
                        </div>

                        <div
                            style={{
                                marginTop:
                                    "30px",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap:
                                    "18px",
                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <button
                                type="button"
                                className="button primary"
                                disabled={
                                    isRunning
                                }
                                onClick={
                                    handleGenerate
                                }
                            >
                                {isRunning
                                    ? "Visual identity is running..."
                                    : "Build visual identity →"}
                            </button>

                            <span className="muted small">
                                Your Shape decisions
                                are used as part of the
                                visual context.
                            </span>
                        </div>
                    </section>
                ) : (
                    <section
                        style={{
                            paddingBottom:
                                "80px",
                        }}
                    >
                        <div
                            className="surface"
                            style={{
                                marginBottom:
                                    "30px",
                                padding:
                                    "28px 32px",
                            }}
                        >
                            <span className="eyebrow">
                                Visual direction
                            </span>

                            <h2>
                                See how the brand should look.
                            </h2>

                            <p
                                className="muted"
                                style={{
                                    maxWidth:
                                        "760px",
                                    marginTop:
                                        "8px",
                                    lineHeight:
                                        1.7,
                                }}
                            >
                                The visual system below
                                connects direction, imagery,
                                color, typography, and design
                                principles into one coherent
                                identity.
                            </p>
                        </div>

                        <VisualBoard
                            direction={
                                normalized.direction
                            }
                            keywords={
                                normalized.keywords
                            }
                            imagery={
                                normalized.imagery
                            }
                            principles={
                                normalized.principles
                            }
                        />

                        <ColorPalette
                            colors={
                                normalized.colors
                            }
                        />

                        <TypographyCard
                            choices={
                                normalized.typography
                            }
                        />

                        <div
                            className="surface"
                            style={{
                                marginTop:
                                    "30px",
                                padding:
                                    "26px 30px",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                gap:
                                    "20px",
                                flexWrap:
                                    "wrap",
                            }}
                        >
                            <div>
                                <span className="eyebrow">
                                    Continue the workflow
                                </span>

                                <h3>
                                    Ready to stress-test
                                    the visual system?
                                </h3>

                                <p
                                    className="muted small"
                                    style={{
                                        marginTop:
                                            "6px",
                                    }}
                                >
                                    The visual decisions
                                    will carry forward into
                                    the Challenge stage.
                                </p>
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap:
                                        "12px",
                                    flexWrap:
                                        "wrap",
                                }}
                            >
                                <button
                                    type="button"
                                    className="button"
                                    disabled={
                                        isRunning
                                    }
                                    onClick={
                                        handleGenerate
                                    }
                                >
                                    {isRunning
                                        ? "Running..."
                                        : "Visualize again"}
                                </button>

                                <button
                                    type="button"
                                    className="button primary"
                                    disabled={
                                        isRunning
                                    }
                                    onClick={() =>
                                        router.push(
                                            `/project/${encodeURIComponent(
                                                project.id,
                                            )}/challenge`,
                                        )
                                    }
                                >
                                    Continue to challenge →
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                <footer className="site-footer">
                    <span>
                        Brand Intelligence
                    </span>

                    <span>
                        Stage 04 · Visualize
                    </span>
                </footer>
            </div>
        </main>
    );
}