"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { ConsistencyCheck } from "../../../../components/challenge/ConsistencyCheck";
import type { ConsistencyItem } from "../../../../components/challenge/ConsistencyCheck";

import { CritiquePanel } from "../../../../components/challenge/CritiquePanel";
import type { BrandIssue } from "../../../../components/challenge/IssueCard";

import { useBrandKit } from "../../../../hooks/useBrandKit";
import { useProject } from "../../../../hooks/useProject";
import { useWorkflow } from "../../../../hooks/useWorkflow";

import {
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


function readSeverity(
    value: unknown,
): BrandIssue["severity"] {
    if (
        value === "low" ||
        value === "medium" ||
        value === "high"
    ) {
        return value;
    }

    return undefined;
}


function readStatus(
    value: unknown,
): ConsistencyItem["status"] {
    if (
        value === "pass" ||
        value === "warning" ||
        value === "fail"
    ) {
        return value;
    }

    return "warning";
}


function normalizeIssues(
    value: unknown,
): BrandIssue[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(isRecord)
        .map(
            (
                item,
            ): BrandIssue => ({
                title:
                    readString(
                        item.title,
                    ) ??
                    readString(
                        item.name,
                    ) ??
                    "Brand issue",

                description:
                    readString(
                        item.description,
                    ) ??
                    readString(
                        item.issue,
                    ) ??
                    readString(
                        item.explanation,
                    ) ??
                    "The challenge stage identified an area that needs review.",

                severity:
                    readSeverity(
                        item.severity,
                    ),

                category:
                    readString(
                        item.category,
                    ),

                recommendation:
                    readString(
                        item.recommendation,
                    ) ??
                    readString(
                        item.recommended_action,
                    ),
            }),
        );
}


function normalizeConsistency(
    value: unknown,
): ConsistencyItem[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(isRecord)
        .map(
            (
                item,
            ): ConsistencyItem => ({
                area:
                    readString(
                        item.area,
                    ) ??
                    readString(
                        item.name,
                    ) ??
                    "Consistency area",

                status:
                    readStatus(
                        item.status,
                    ),

                explanation:
                    readString(
                        item.explanation,
                    ) ??
                    readString(
                        item.description,
                    ) ??
                    "No explanation was provided.",
            }),
        );
}


function unwrapWorkflowOutput(
    value: unknown,
): Record<string, unknown> {
    if (!isRecord(value)) {
        return {};
    }

    if (isRecord(value.result)) {
        return value.result;
    }

    return value;
}


const workflowStages = [
    {
        number: "01",
        title: "Discover",
        description:
            "Understand the opportunity",
        active: false,
    },
    {
        number: "02",
        title: "Position",
        description:
            "Choose the strategic direction",
        active: false,
    },
    {
        number: "03",
        title: "Shape",
        description:
            "Build the brand expression",
        active: false,
    },
    {
        number: "04",
        title: "Visualize",
        description:
            "Explore the visual identity",
        active: false,
    },
    {
        number: "05",
        title: "Challenge",
        description:
            "Stress-test the decisions",
        active: true,
    },
    {
        number: "06",
        title: "Deliver",
        description:
            "Assemble the final system",
        active: false,
    },
];


export default function ChallengePage() {
    const router = useRouter();

    const params = useParams<{
        id?: string;
    }>();

    const projectId =
        params?.id ?? null;


    const {
        project,
        loading:
        projectLoading,
        error:
        projectError,
    } = useProject(projectId);


    const {
        brand,
        loading:
        brandLoading,
        error:
        brandError,
    } = useBrandKit(projectId);


    const {
        startStage,
        latestRun,
        submitting,
        error:
        workflowError,
    } = useWorkflow(projectId);


    const challengeRun =
        latestRun("challenge");


    /*
     * Prefer the newest workflow response.
     *
     * AIML returns:
     *
     * {
     *   "result": {
     *      ...
     *   }
     * }
     *
     * Fall back to persisted brand state
     * when there is no workflow result.
     */
    const challengeData:
        Record<string, unknown> =
        useMemo(() => {
            if (
                challengeRun?.output_data
            ) {
                return unwrapWorkflowOutput(
                    challengeRun.output_data,
                );
            }

            const stored =
                getStageData(
                    brand?.data,
                    "challenge",
                );

            return isRecord(stored)
                ? stored
                : {};
        }, [
            challengeRun?.output_data,
            brand?.data,
        ]);


    const normalized =
        useMemo(() => {
            const rawIssues =
                challengeData.issues ??
                challengeData.risks ??
                [];

            const rawConsistency =
                challengeData.consistency ??
                challengeData.consistency_checks ??
                [];

            return {
                summary:
                    readString(
                        challengeData.summary,
                    ) ??
                    readString(
                        challengeData.overall_assessment,
                    ),

                issues:
                    normalizeIssues(
                        rawIssues,
                    ),

                strengths:
                    readStrings(
                        challengeData.strengths,
                    ),

                recommendations:
                    readStrings(
                        challengeData.recommendations,
                    ),

                consistency:
                    normalizeConsistency(
                        rawConsistency,
                    ),
            };
        }, [
            challengeData,
        ]);


    const handleRunChallenge =
        async () => {
            if (!project) {
                return;
            }

            await startStage(
                "challenge",
                {
                    idea:
                        project.idea,

                    brand_context:
                        brand?.data ?? {},

                    selections:
                        {},

                    instructions:
                        "Stress-test the current brand system. Identify contradictions, gaps, risks, weak assumptions, and inconsistencies across strategy, personality, naming, voice, and visual identity. Return structured issues, consistency checks, strengths, and recommended actions.",
                },
            );
        };


    const isRunning =
        submitting ||
        challengeRun?.status ===
        "pending" ||
        challengeRun?.status ===
        "running";


    const hasResult =
        normalized.issues.length > 0 ||
        normalized.consistency.length > 0 ||
        normalized.strengths.length > 0 ||
        normalized.recommendations.length > 0 ||
        Boolean(
            normalized.summary,
        ) ||
        Boolean(
            challengeRun?.output_data,
        );


    if (
        projectLoading ||
        brandLoading
    ) {
        return (
            <main>
                <div className="site-container">

                    <header
                        className="site-header"
                    >
                        <div
                            className="brand-lockup"
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

                                <small
                                    className="muted"
                                >
                                    Connected brand thinking
                                </small>
                            </span>
                        </div>

                        <span
                            className="muted small"
                        >
                            Stage 05
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
                            <span
                                className="eyebrow"
                            >
                                Stage 05 · Challenge
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
                                Loading the
                                challenge stage
                            </h1>

                            <p
                                className="muted"
                            >
                                Restoring the current
                                brand system before
                                stress-testing it.
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

                    <header
                        className="site-header"
                    >
                        <div
                            className="brand-lockup"
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

                                <small
                                    className="muted"
                                >
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
                            <span
                                className="eyebrow"
                            >
                                Project unavailable
                            </span>

                            <h1>
                                We could not load
                                this project.
                            </h1>

                            <p
                                className="muted"
                            >
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


    return (
        <main>
            <div className="site-container">

                <header
                    className="site-header"
                >
                    <div
                        className="brand-lockup"
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

                            <small
                                className="muted"
                            >
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
                            gap:
                                "12px",
                        }}
                    >
                        <span
                            className="muted small"
                        >
                            {project.name}
                        </span>

                        <button
                            type="button"
                            className="button compact"
                            onClick={() =>
                                router.push(
                                    `/project/${encodeURIComponent(
                                        project.id,
                                    )}/visualize`,
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

                            <span
                                className="eyebrow"
                            >
                                Stage 05 · Challenge
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
                                Stress-test the
                                brand.
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
                                Look for contradictions,
                                gaps, risks, and
                                inconsistencies before
                                treating the identity as
                                launch-ready.
                            </p>

                        </div>


                        <aside
                            className="surface"
                            style={{
                                padding:
                                    "24px",
                            }}
                        >

                            <span
                                className="eyebrow"
                            >
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
                                Find weaknesses
                                before launch.
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
                                A useful challenge
                                looks across the
                                connected brand system
                                instead of checking one
                                decision in isolation.
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
                                (
                                    stage,
                                ) => (
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
                                We could not complete
                                that step.
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

                                <span
                                    className="eyebrow"
                                >
                                    Ready for review
                                </span>

                                <h2>
                                    Challenge the current
                                    decisions.
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
                                    The challenge pass
                                    examines the
                                    accumulated brand
                                    context rather than
                                    starting from the
                                    original idea alone.
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
                                05
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
                                    handleRunChallenge
                                }
                            >
                                {isRunning
                                    ? "Challenge is running..."
                                    : "Run brand challenge →"}
                            </button>

                            <span
                                className="muted small"
                            >
                                The current strategy,
                                personality, naming,
                                voice, and visual system
                                will be reviewed together.
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

                            <span
                                className="eyebrow"
                            >
                                Challenge results
                            </span>

                            <h2>
                                What needs attention
                                before delivery?
                            </h2>

                            {normalized.summary ? (
                                <p
                                    className="muted"
                                    style={{
                                        maxWidth:
                                            "820px",
                                        marginTop:
                                            "12px",
                                        lineHeight:
                                            1.75,
                                    }}
                                >
                                    {
                                        normalized.summary
                                    }
                                </p>
                            ) : (
                                <p
                                    className="muted"
                                    style={{
                                        maxWidth:
                                            "820px",
                                        marginTop:
                                            "12px",
                                        lineHeight:
                                            1.75,
                                    }}
                                >
                                    Review the identified
                                    issues, consistency
                                    checks, strengths, and
                                    recommended actions below.
                                </p>
                            )}

                        </div>


                        <CritiquePanel
                            summary={
                                normalized.summary
                            }
                            issues={
                                normalized.issues
                            }
                            strengths={
                                normalized.strengths
                            }
                            recommendations={
                                normalized.recommendations
                            }
                        />


                        <ConsistencyCheck
                            items={
                                normalized.consistency
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

                                <span
                                    className="eyebrow"
                                >
                                    Continue the workflow
                                </span>

                                <h3>
                                    Ready to assemble
                                    the brand kit?
                                </h3>

                                <p
                                    className="muted small"
                                    style={{
                                        marginTop:
                                            "6px",
                                    }}
                                >
                                    The challenge findings
                                    remain part of the
                                    project context as you
                                    move into delivery.
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
                                        handleRunChallenge
                                    }
                                >
                                    {isRunning
                                        ? "Running..."
                                        : "Run challenge again"}
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
                                            )}/brand-kit`,
                                        )
                                    }
                                >
                                    Continue to brand
                                    kit →
                                </button>

                            </div>

                        </div>

                    </section>

                )}


                <footer
                    className="site-footer"
                >
                    <span>
                        Brand Intelligence
                    </span>

                    <span>
                        Stage 05 · Challenge
                    </span>
                </footer>

            </div>
        </main>
    );
}