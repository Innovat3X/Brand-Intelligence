"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { DiscoveryResult } from "../../../../components/discovery/DiscoveryResult";
import { IdeaInput } from "../../../../components/discovery/IdeaInput";
import { InterviewPanel } from "../../../../components/discovery/InterviewPanel";
import { useBrandKit } from "../../../../hooks/useBrandKit";
import { useProject } from "../../../../hooks/useProject";
import { useWorkflow } from "../../../../hooks/useWorkflow";
import {
    buildStageInput,
    getStageData,
    hasContent,
    isRecord,
} from "../../../../lib/brand";

function extractQuestions(value: unknown): string[] {
    if (!isRecord(value)) {
        return [];
    }

    const candidates = [
        value.questions,
        value.interview_questions,
        value.follow_up_questions,
        value.open_questions,
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            const questions = candidate.filter(
                (item): item is string =>
                    typeof item === "string" && item.trim().length > 0,
            );

            if (questions.length > 0) {
                return questions;
            }
        }
    }

    return [];
}

function unwrapWorkflowOutput(value: unknown): unknown {
    if (!isRecord(value)) {
        return null;
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
        description: "Understand the opportunity",
        active: true,
    },
    {
        number: "02",
        title: "Position",
        description: "Define the strategic direction",
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

export default function DiscoveryPage() {
    const router = useRouter();
    const params = useParams<{ id?: string }>();
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

    const discoveryRun = latestRun("discovery");

    /*
     * Prefer the latest workflow output.
     *
     * The AIML service returns:
     * {
     *   "result": {
     *      ...discovery output...
     *   }
     * }
     *
     * The saved brand state may still be empty immediately after
     * the workflow finishes, so the workflow result must be preferred.
     */
    const workflowDiscoveryData = unwrapWorkflowOutput(
        discoveryRun?.output_data,
    );

    const savedDiscoveryData = getStageData(
        brand?.data,
        "discovery",
    );

    const discoveryData = hasContent(workflowDiscoveryData)
        ? workflowDiscoveryData
        : savedDiscoveryData;

    const [idea, setIdea] = useState("");
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const initialIdea = useMemo(
        () => project?.idea ?? "",
        [project?.idea],
    );

    const questions = useMemo(
        () => extractQuestions(discoveryData),
        [discoveryData],
    );

    const handleIdeaSubmit = async (value: string) => {
        setIdea(value);

        const input = buildStageInput(
            value,
            brand?.data,
            {},
            "Analyze the rough idea. Identify the problem, audience, context, opportunity, constraints, assumptions, and useful follow-up questions. Return structured discovery output.",
        );

        const run = await startStage(
            "discovery",
            input,
        );

        if (run) {
            setAnswers({});
        }
    };

    const handleAnswer = (
        question: string,
        answer: string,
    ) => {
        setAnswers((current) => ({
            ...current,
            [question]: answer,
        }));
    };

    const handleContinue = async () => {
        const currentIdea =
            idea.trim() || initialIdea.trim();

        if (!currentIdea) {
            return;
        }

        const input = buildStageInput(
            currentIdea,
            brand?.data,
            {},
            JSON.stringify({
                action: "refine_discovery",
                answers,
                instruction:
                    "Refine the discovery using the founder answers. Preserve useful information from the previous discovery output and return the strongest structured discovery result.",
            }),
        );

        const run = await startStage(
            "discovery",
            input,
        );

        if (run) {
            router.push(
                `/project/${encodeURIComponent(
                    projectId ?? "",
                )}/positioning`,
            );
        }
    };

    if (projectLoading || brandLoading) {
        return (
            <main>
                <div className="site-container">
                    <header className="site-header">
                        <Link
                            href="/"
                            className="brand-lockup"
                            aria-label="Brand Intelligence home"
                        >
                            <span className="brand-mark" aria-hidden="true">
                                <span />
                                <span />
                                <span />
                                <span />
                            </span>

                            <span>
                                <strong>Brand Intelligence</strong>
                                <small className="muted">
                                    Connected brand thinking
                                </small>
                            </span>
                        </Link>

                        <Link href="/" className="button">
                            Exit
                        </Link>
                    </header>

                    <section
                        className="surface"
                        style={{
                            margin: "56px auto 80px",
                            maxWidth: "860px",
                            minHeight: "420px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }}
                    >
                        <div
                            className="stack"
                            style={{
                                alignItems: "center",
                                maxWidth: "560px",
                            }}
                        >
                            <span className="eyebrow">
                                Stage 01 · Discover
                            </span>

                            <div
                                aria-hidden="true"
                                style={{
                                    width: "58px",
                                    height: "58px",
                                    borderRadius: "50%",
                                    background: "var(--bg)",
                                    boxShadow: "var(--inset-shadow)",
                                    margin: "8px 0",
                                }}
                            />

                            <h1>Loading discovery</h1>

                            <p className="muted">
                                Restoring the project context before
                                discovery begins.
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
                            <span className="brand-mark" aria-hidden="true">
                                <span />
                                <span />
                                <span />
                                <span />
                            </span>

                            <span>
                                <strong>Brand Intelligence</strong>
                                <small className="muted">
                                    Connected brand thinking
                                </small>
                            </span>
                        </Link>
                    </header>

                    <section
                        className="surface"
                        style={{
                            margin: "56px auto 80px",
                            maxWidth: "760px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            className="stack"
                            style={{ alignItems: "center" }}
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
                                onClick={() => router.push("/")}
                            >
                                Back to home
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        );
    }

    const displayIdea =
        idea.trim() || initialIdea;

    const hasDiscoveryResult =
        hasContent(discoveryData) ||
        discoveryRun?.status === "completed";

    const isRunning =
        submitting ||
        discoveryRun?.status === "pending" ||
        discoveryRun?.status === "running";

    return (
        <main>
            <div className="site-container">
                <header className="site-header">
                    <Link
                        href="/"
                        className="brand-lockup"
                        aria-label="Brand Intelligence home"
                    >
                        <span className="brand-mark" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <span />
                        </span>

                        <span>
                            <strong>Brand Intelligence</strong>
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

                        <Link href="/" className="button compact">
                            Exit
                        </Link>
                    </div>
                </header>

                <section
                    style={{
                        padding: "52px 0 70px",
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
                                Stage 01 · Discover
                            </span>

                            <h1
                                style={{
                                    maxWidth: "820px",
                                    fontSize:
                                        "clamp(2.6rem, 5.2vw, 4.7rem)",
                                    lineHeight: 1.04,
                                    letterSpacing: "-0.055em",
                                }}
                            >
                                Understand the opportunity.
                            </h1>

                            <p
                                className="muted"
                                style={{
                                    maxWidth: "650px",
                                    marginTop: "24px",
                                    fontSize: "1rem",
                                    lineHeight: 1.75,
                                }}
                            >
                                Start with the rough idea. Discovery turns it
                                into a clearer problem, audience, context,
                                and opportunity while preserving the original
                                intent.
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
                                Start with the problem, not the brand.
                            </strong>

                            <p
                                className="muted small"
                                style={{
                                    marginTop: "10px",
                                    lineHeight: 1.6,
                                }}
                            >
                                The brand direction comes later. First,
                                understand what needs to exist and why.
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
                            {workflowStages.map((stage) => (
                                <div
                                    key={stage.number}
                                    style={{
                                        position: "relative",
                                        padding: "12px 10px",
                                        borderRadius: "12px",
                                        background: "var(--bg)",
                                        boxShadow: stage.active
                                            ? "var(--inset-shadow)"
                                            : "none",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <span
                                            className="preview-number"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                boxShadow: stage.active
                                                    ? "var(--small-shadow)"
                                                    : "var(--inset-shadow)",
                                            }}
                                        >
                                            {stage.number}
                                        </span>

                                        <strong
                                            style={{
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            {stage.title}
                                        </strong>
                                    </div>

                                    <p
                                        className="muted"
                                        style={{
                                            marginTop: "9px",
                                            fontSize: "0.68rem",
                                            lineHeight: 1.45,
                                        }}
                                    >
                                        {stage.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section
                    style={{
                        display: "grid",
                        gap: "30px",
                        paddingBottom: "80px",
                    }}
                >
                    <div className="surface">
                        <div
                            style={{
                                marginBottom: "22px",
                            }}
                        >
                            <span className="eyebrow">
                                Step 1 · Starting point
                            </span>

                            <h2>Put the idea on the table.</h2>

                            <p
                                className="muted"
                                style={{
                                    marginTop: "8px",
                                    maxWidth: "700px",
                                }}
                            >
                                Describe the idea in its current form. It does
                                not need to be polished.
                            </p>
                        </div>

                        <IdeaInput
                            initialIdea={displayIdea}
                            disabled={isRunning}
                            onSubmit={handleIdeaSubmit}
                        />
                    </div>

                    {workflowError || brandError ? (
                        <div
                            className="notice error-notice"
                            role="alert"
                        >
                            <div>
                                <strong>
                                    We could not complete that step.
                                </strong>

                                <p>
                                    {workflowError ?? brandError}
                                </p>
                            </div>
                        </div>
                    ) : null}

                    {hasDiscoveryResult ? (
                        <>
                            <div className="surface">
                                <div
                                    style={{
                                        marginBottom: "24px",
                                    }}
                                >
                                    <span className="eyebrow">
                                        Step 2 · Discovery output
                                    </span>

                                    <h2>
                                        Here is what the idea is telling us.
                                    </h2>

                                    <p
                                        className="muted"
                                        style={{
                                            marginTop: "8px",
                                            maxWidth: "720px",
                                        }}
                                    >
                                        Review the emerging understanding
                                        before moving deeper into the brand.
                                    </p>
                                </div>

                                <DiscoveryResult
                                    data={discoveryData}
                                />
                            </div>

                            <div className="surface">
                                <div
                                    style={{
                                        marginBottom: "24px",
                                    }}
                                >
                                    <span className="eyebrow">
                                        Step 3 · Founder perspective
                                    </span>

                                    <h2>
                                        Clarify what the analysis cannot know.
                                    </h2>

                                    <p
                                        className="muted"
                                        style={{
                                            marginTop: "8px",
                                            maxWidth: "720px",
                                        }}
                                    >
                                        Answer the useful follow-up questions
                                        to strengthen the discovery context.
                                    </p>
                                </div>

                                <InterviewPanel
                                    questions={questions}
                                    answers={answers}
                                    disabled={isRunning}
                                    onAnswer={handleAnswer}
                                />
                            </div>

                            <div
                                className="surface"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "24px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div>
                                    <span className="eyebrow">
                                        Next stage
                                    </span>

                                    <h2>
                                        Ready to move from understanding to
                                        positioning?
                                    </h2>

                                    <p
                                        className="muted"
                                        style={{
                                            marginTop: "7px",
                                        }}
                                    >
                                        Your discovery context will carry
                                        forward into the next stage.
                                    </p>
                                </div>

                                {questions.length > 0 ? (
                                    <button
                                        type="button"
                                        className="button primary"
                                        disabled={
                                            isRunning ||
                                            !Object.values(
                                                answers,
                                            ).some(
                                                (answer) =>
                                                    answer.trim().length > 0,
                                            )
                                        }
                                        onClick={handleContinue}
                                    >
                                        {isRunning
                                            ? "Refining..."
                                            : "Refine discovery →"}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="button primary"
                                        disabled={isRunning}
                                        onClick={() =>
                                            router.push(
                                                `/project/${encodeURIComponent(
                                                    project.id,
                                                )}/positioning`,
                                            )
                                        }
                                    >
                                        Continue to positioning →
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div
                            className="surface"
                            style={{
                                textAlign: "center",
                                padding: "42px 28px",
                            }}
                        >
                            <span className="eyebrow">
                                Discovery
                            </span>

                            <h2>
                                Your analysis will appear here.
                            </h2>

                            <p
                                className="muted"
                                style={{
                                    maxWidth: "560px",
                                    margin: "10px auto 0",
                                }}
                            >
                                Submit the idea above to begin the first stage
                                of the workflow.
                            </p>
                        </div>
                    )}
                </section>

                <footer className="site-footer">
                    <span>Brand Intelligence</span>
                    <span>Stage 01 · Discover</span>
                </footer>
            </div>
        </main>
    );
}