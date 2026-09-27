"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
    DirectionSelector,
    type PositioningDirection,
} from "../../../../components/positioning/DirectionSelector";

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

function normalizeDirections(
    value: unknown,
): PositioningDirection[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(isRecord)
        .map(
            (
                item,
                index,
            ): PositioningDirection => ({
                id:
                    readString(item.id) ??
                    readString(item.key) ??
                    `direction-${index + 1}`,

                title:
                    readString(item.title) ??
                    readString(item.name) ??
                    `Direction ${index + 1}`,

                description:
                    readString(
                        item.description,
                    ) ??
                    readString(item.summary) ??
                    "No description was provided.",

                rationale:
                    readString(
                        item.rationale,
                    ) ??
                    readString(item.reasoning),

                differentiator:
                    readString(
                        item.differentiator,
                    ) ??
                    readString(item.difference),

                valueProposition:
                    readString(
                        item.value_proposition,
                    ) ??
                    readString(
                        item.valueProposition,
                    ),
            }),
        );
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
        active: true,
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
        active: false,
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

export default function PositioningPage() {
    const router = useRouter();

    const params = useParams<{
        id?: string;
    }>();

    const projectId = params?.id ?? null;

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

    const positioningRun =
        latestRun("positioning");

    const positioningData =
        getStageData(
            brand?.data,
            "positioning",
        );

    const directions = useMemo(() => {
        if (!isRecord(positioningData)) {
            return [];
        }

        const candidates =
            positioningData.directions ??
            positioningData.positioning_directions ??
            positioningData.options;

        return normalizeDirections(
            candidates,
        );
    }, [positioningData]);

    const [
        selectedDirectionId,
        setSelectedDirectionId,
    ] = useState<string | null>(null);

    const selectedDirection =
        directions.find(
            (direction) =>
                direction.id ===
                selectedDirectionId,
        ) ?? null;

    const handleGenerate = async () => {
        if (!project) {
            return;
        }

        await startStage(
            "positioning",
            buildStageInput(
                project.idea,
                brand?.data,
                {},
                "Develop several meaningful positioning directions from the current discovery context. Each direction should make a distinct strategic choice about audience, value, differentiation, and market position. Return structured positioning directions with clear reasoning.",
            ),
        );
    };

    const handleSelect = (
        direction: PositioningDirection,
    ) => {
        setSelectedDirectionId(
            direction.id,
        );
    };

    const handleContinue = () => {
        if (!project || !selectedDirection) {
            return;
        }

        router.push(
            `/project/${encodeURIComponent(
                project.id,
            )}/shape`,
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
                        <Link
                            href="/"
                            className="brand-lockup"
                            aria-label="Brand Intelligence home"
                        >
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
                        </Link>

                        <Link
                            href="/"
                            className="button compact"
                        >
                            Exit
                        </Link>
                    </header>

                    <section
                        className="surface"
                        style={{
                            maxWidth: "860px",
                            minHeight: "420px",
                            margin: "56px auto 80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }}
                    >
                        <div
                            className="stack"
                            style={{
                                maxWidth: "560px",
                                alignItems: "center",
                            }}
                        >
                            <span className="eyebrow">
                                Stage 02 · Position
                            </span>

                            <div
                                aria-hidden="true"
                                style={{
                                    width: "58px",
                                    height: "58px",
                                    margin: "8px 0",
                                    borderRadius: "50%",
                                    background:
                                        "var(--bg)",
                                    boxShadow:
                                        "var(--inset-shadow)",
                                }}
                            />

                            <h1>
                                Loading positioning
                            </h1>

                            <p className="muted">
                                Restoring discovery context
                                before making the strategic
                                choice.
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
                        <Link
                            href="/"
                            className="brand-lockup"
                            aria-label="Brand Intelligence home"
                        >
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
                        </Link>
                    </header>

                    <section
                        className="surface"
                        style={{
                            maxWidth: "760px",
                            margin: "56px auto 80px",
                            padding: "42px 32px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            className="stack"
                            style={{
                                alignItems: "center",
                            }}
                        >
                            <span className="eyebrow">
                                Project unavailable
                            </span>

                            <h1>
                                We could not load this project.
                            </h1>

                            <p className="muted">
                                {projectError ??
                                    "The requested project could not be found."}
                            </p>

                            <button
                                type="button"
                                className="button primary"
                                onClick={() =>
                                    router.push("/")
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
        positioningRun?.status ===
        "pending" ||
        positioningRun?.status ===
        "running";

    return (
        <main>
            <div className="site-container">
                <header className="site-header">
                    <Link
                        href="/"
                        className="brand-lockup"
                        aria-label="Brand Intelligence home"
                    >
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
                    </Link>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <span className="muted small">
                            {project.name}
                        </span>

                        <Link
                            href="/"
                            className="button compact"
                        >
                            Exit
                        </Link>
                    </div>
                </header>

                <section
                    style={{
                        padding: "52px 0 38px",
                    }}
                >
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "minmax(0, 1.35fr) minmax(260px, 0.65fr)",
                            gap: "34px",
                            alignItems: "start",
                        }}
                    >
                        <div>
                            <span className="eyebrow">
                                Stage 02 · Position
                            </span>

                            <h1
                                style={{
                                    maxWidth: "820px",
                                    margin: 0,
                                    fontSize:
                                        "clamp(2.6rem, 5.2vw, 4.7rem)",
                                    lineHeight: 1.04,
                                    letterSpacing:
                                        "-0.055em",
                                }}
                            >
                                Choose a strategic
                                direction.
                            </h1>

                            <p
                                className="muted"
                                style={{
                                    maxWidth: "680px",
                                    marginTop: "24px",
                                    fontSize: "1rem",
                                    lineHeight: 1.75,
                                }}
                            >
                                Positioning turns the discovery
                                work into an explicit choice
                                about who the brand serves,
                                what it promises, and why it
                                should be different.
                            </p>
                        </div>

                        <aside
                            className="surface"
                            style={{
                                padding: "24px",
                            }}
                        >
                            <span className="eyebrow">
                                Working principle
                            </span>

                            <strong
                                style={{
                                    display: "block",
                                    fontSize: "1.05rem",
                                    lineHeight: 1.5,
                                }}
                            >
                                Make the strategic choice
                                explicit.
                            </strong>

                            <p
                                className="muted small"
                                style={{
                                    marginTop: "10px",
                                    lineHeight: 1.6,
                                }}
                            >
                                Different positions create
                                different implications for
                                audience, value, differentiation,
                                and expression.
                            </p>
                        </aside>
                    </div>

                    <div
                        className="surface"
                        style={{
                            marginTop: "34px",
                            padding: "18px 20px",
                            overflowX: "auto",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(6, minmax(145px, 1fr))",
                                minWidth: "880px",
                                gap: "10px",
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
                                                gap: "10px",
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
                            marginBottom: "30px",
                        }}
                    >
                        <div>
                            <strong>
                                We could not complete that step.
                            </strong>

                            <p>
                                {workflowError ??
                                    brandError}
                            </p>
                        </div>
                    </div>
                ) : null}

                {directions.length === 0 ? (
                    <section
                        className="surface"
                        style={{
                            margin: "0 0 80px",
                            padding: "42px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems:
                                    "flex-start",
                                justifyContent:
                                    "space-between",
                                gap: "30px",
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: "700px",
                                }}
                            >
                                <span className="eyebrow">
                                    Strategic exploration
                                </span>

                                <h2>
                                    Generate positioning
                                    directions.
                                </h2>

                                <p
                                    className="muted"
                                    style={{
                                        marginTop: "10px",
                                        lineHeight: 1.7,
                                    }}
                                >
                                    The system will use the
                                    accumulated discovery
                                    context to develop
                                    distinct strategic
                                    directions rather than
                                    giving you one generic
                                    positioning statement.
                                </p>
                            </div>

                            <span
                                className="preview-number"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    flexShrink: 0,
                                    boxShadow:
                                        "var(--small-shadow)",
                                }}
                            >
                                02
                            </span>
                        </div>

                        <div
                            style={{
                                marginTop: "30px",
                                display: "flex",
                                alignItems:
                                    "center",
                                gap: "18px",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                type="button"
                                className="button primary"
                                disabled={isRunning}
                                onClick={
                                    handleGenerate
                                }
                            >
                                {isRunning
                                    ? "Positioning is running..."
                                    : "Generate directions →"}
                            </button>

                            <span className="muted small">
                                Discovery context will
                                be carried forward
                                automatically.
                            </span>
                        </div>
                    </section>
                ) : (
                    <section
                        style={{
                            paddingBottom: "80px",
                        }}
                    >
                        <div
                            className="surface"
                            style={{
                                marginBottom: "30px",
                                padding: "32px",
                            }}
                        >
                            <span className="eyebrow">
                                Strategic options
                            </span>

                            <h2>
                                Choose the position
                                that best represents
                                the opportunity.
                            </h2>

                            <p
                                className="muted"
                                style={{
                                    maxWidth: "720px",
                                    marginTop: "9px",
                                    lineHeight: 1.7,
                                }}
                            >
                                Each direction represents
                                a different strategic
                                choice. Review the
                                reasoning before committing
                                to one.
                            </p>
                        </div>

                        <DirectionSelector
                            directions={directions}
                            selectedId={
                                selectedDirectionId
                            }
                            disabled={isRunning}
                            onSelect={
                                handleSelect
                            }
                        />

                        {selectedDirection ? (
                            <div
                                className="surface"
                                style={{
                                    marginTop: "30px",
                                    padding: "30px",
                                }}
                            >
                                <span className="eyebrow">
                                    Selected direction
                                </span>

                                <h2>
                                    {
                                        selectedDirection.title
                                    }
                                </h2>

                                <p
                                    className="muted"
                                    style={{
                                        marginTop:
                                            "9px",
                                        maxWidth:
                                            "760px",
                                        lineHeight:
                                            1.7,
                                    }}
                                >
                                    {
                                        selectedDirection.description
                                    }
                                </p>

                                {selectedDirection.valueProposition ? (
                                    <div
                                        style={{
                                            marginTop:
                                                "22px",
                                            padding:
                                                "20px",
                                            borderRadius:
                                                "14px",
                                            background:
                                                "var(--bg)",
                                            boxShadow:
                                                "var(--inset-shadow)",
                                        }}
                                    >
                                        <span className="eyebrow">
                                            Value proposition
                                        </span>

                                        <strong
                                            style={{
                                                display:
                                                    "block",
                                                marginTop:
                                                    "6px",
                                                lineHeight:
                                                    1.6,
                                            }}
                                        >
                                            {
                                                selectedDirection.valueProposition
                                            }
                                        </strong>
                                    </div>
                                ) : null}

                                {selectedDirection.differentiator ? (
                                    <div
                                        style={{
                                            marginTop:
                                                "18px",
                                        }}
                                    >
                                        <span className="eyebrow">
                                            Differentiator
                                        </span>

                                        <p
                                            style={{
                                                marginTop:
                                                    "5px",
                                                lineHeight:
                                                    1.6,
                                            }}
                                        >
                                            {
                                                selectedDirection.differentiator
                                            }
                                        </p>
                                    </div>
                                ) : null}

                                {selectedDirection.rationale ? (
                                    <div
                                        style={{
                                            marginTop:
                                                "18px",
                                        }}
                                    >
                                        <span className="eyebrow">
                                            Rationale
                                        </span>

                                        <p
                                            className="muted"
                                            style={{
                                                marginTop:
                                                    "5px",
                                                lineHeight:
                                                    1.6,
                                            }}
                                        >
                                            {
                                                selectedDirection.rationale
                                            }
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div
                                className="surface"
                                style={{
                                    marginTop: "30px",
                                    padding:
                                        "28px",
                                    textAlign:
                                        "center",
                                }}
                            >
                                <span className="eyebrow">
                                    Selection required
                                </span>

                                <h2>
                                    Select a direction
                                    to continue.
                                </h2>

                                <p
                                    className="muted"
                                    style={{
                                        marginTop:
                                            "8px",
                                    }}
                                >
                                    Review the available
                                    options above and
                                    choose the strategic
                                    direction you want to
                                    carry forward.
                                </p>
                            </div>
                        )}

                        <div
                            className="surface"
                            style={{
                                marginTop: "30px",
                                padding: "26px 30px",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                gap: "20px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div>
                                <span className="eyebrow">
                                    Continue the workflow
                                </span>

                                <h3>
                                    Carry this decision
                                    into shaping.
                                </h3>

                                <p
                                    className="muted small"
                                    style={{
                                        marginTop:
                                            "5px",
                                    }}
                                >
                                    The selected
                                    positioning becomes
                                    part of the next
                                    stage's context.
                                </p>
                            </div>

                            <div
                                className="button-row"
                                style={{
                                    justifyContent:
                                        "flex-end",
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
                                        : "Explore again"}
                                </button>

                                <button
                                    type="button"
                                    className="button primary"
                                    disabled={
                                        isRunning ||
                                        !selectedDirection
                                    }
                                    onClick={
                                        handleContinue
                                    }
                                >
                                    Continue to shaping →
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
                        Stage 02 · Position
                    </span>
                </footer>
            </div>
        </main>
    );
}