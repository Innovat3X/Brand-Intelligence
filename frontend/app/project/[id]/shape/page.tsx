"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    NamingCard,
    type NamingOption,
} from "../../../../components/shape/NamingCard";
import { PersonalityCard } from "../../../../components/shape/PersonalityCard";
import { VoiceCard } from "../../../../components/shape/VoiceCard";

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


function normalizeNamingOptions(
    value: unknown,
): NamingOption[] {
    let candidates: unknown = value;

    if (isRecord(value)) {
        candidates =
            value.options ??
            value.names ??
            value.naming_options ??
            value.directions;
    }

    if (!Array.isArray(candidates)) {
        return [];
    }

    return candidates
        .filter(isRecord)
        .map(
            (
                item,
                index,
            ): NamingOption => ({
                name:
                    readString(item.name) ??
                    readString(item.title) ??
                    `Name ${index + 1}`,

                rationale:
                    readString(
                        item.rationale,
                    ) ??
                    readString(
                        item.reasoning,
                    ),

                territory:
                    readString(
                        item.territory,
                    ) ??
                    readString(
                        item.naming_territory,
                    ),

                strengths:
                    readStrings(
                        item.strengths,
                    ),

                concerns:
                    readStrings(
                        item.concerns,
                    ).length > 0
                        ? readStrings(
                            item.concerns,
                        )
                        : readStrings(
                            item.considerations,
                        ),
            }),
        );
}


function normalizeShapeData(
    value: unknown,
) {
    if (!isRecord(value)) {
        return {
            personality: [] as string[],
            avoidTraits: [] as string[],
            personalityRationale:
                {} as Record<string, string>,

            naming: [] as NamingOption[],

            voicePrinciples: [] as string[],
            doExamples: [] as string[],
            dontExamples: [] as string[],
            sampleMessages: [] as string[],
        };
    }

    const personalitySource =
        isRecord(value.personality)
            ? value.personality
            : null;

    const personality =
        personalitySource
            ? readStrings(
                personalitySource.traits ??
                personalitySource.attributes ??
                personalitySource.personality,
            )
            : readStrings(
                value.personality,
            );

    const avoidTraits =
        personalitySource
            ? readStrings(
                personalitySource.avoid_traits ??
                personalitySource.avoidTraits ??
                personalitySource.traits_to_avoid,
            )
            : readStrings(
                value.avoid_traits ??
                value.avoidTraits ??
                value.traits_to_avoid,
            );

    const rawRationale =
        personalitySource?.rationale ??
        value.personality_rationale;

    const personalityRationale: Record<
        string,
        string
    > = {};

    if (isRecord(rawRationale)) {
        for (const [
            key,
            entry,
        ] of Object.entries(
            rawRationale,
        )) {
            if (
                typeof entry === "string" &&
                entry.trim().length > 0
            ) {
                personalityRationale[key] =
                    entry.trim();
            }
        }
    }

    const namingSource =
        value.naming ??
        value.names ??
        value.naming_options;

    const naming =
        normalizeNamingOptions(
            namingSource,
        );

    const voiceSource =
        isRecord(value.voice)
            ? value.voice
            : null;

    const voicePrinciples =
        voiceSource
            ? readStrings(
                voiceSource.principles ??
                voiceSource.voice_principles,
            )
            : readStrings(
                value.voice_principles ??
                value.voicePrinciples,
            );

    const doExamples =
        voiceSource
            ? readStrings(
                voiceSource.do_examples ??
                voiceSource.doExamples ??
                voiceSource.do,
            )
            : readStrings(
                value.do_examples ??
                value.doExamples,
            );

    const dontExamples =
        voiceSource
            ? readStrings(
                voiceSource.dont_examples ??
                voiceSource.dontExamples ??
                voiceSource.avoid,
            )
            : readStrings(
                value.dont_examples ??
                value.dontExamples ??
                value.avoid,
            );

    const sampleMessages =
        voiceSource
            ? readStrings(
                voiceSource.sample_messages ??
                voiceSource.sampleMessages ??
                voiceSource.examples,
            )
            : readStrings(
                value.sample_messages ??
                value.sampleMessages,
            );

    return {
        personality,
        avoidTraits,
        personalityRationale,
        naming,
        voicePrinciples,
        doExamples,
        dontExamples,
        sampleMessages,
    };
}


/*
 * AIML workflow responses are wrapped like:
 *
 * {
 *   "result": {
 *      ...
 *   }
 * }
 *
 * This helper unwraps that response so the UI can use
 * the actual Shape data.
 */
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
        active: true,
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
        active: false,
    },
    {
        number: "06",
        title: "Deliver",
        description:
            "Assemble the final system",
        active: false,
    },
];


export default function ShapePage() {
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


    const shapeRun =
        latestRun("shape");


    /*
     * IMPORTANT:
     *
     * First read the latest workflow output.
     * Only fall back to persisted brand state if
     * there is no workflow output.
     */
    const shapeData:
        Record<string, unknown> =
        useMemo(() => {
            if (
                shapeRun?.output_data
            ) {
                return unwrapWorkflowOutput(
                    shapeRun.output_data,
                );
            }

            const stored =
                getStageData(
                    brand?.data,
                    "shape",
                );

            return isRecord(stored)
                ? stored
                : {};
        }, [
            shapeRun?.output_data,
            brand?.data,
        ]);


    const normalized =
        useMemo(
            () =>
                normalizeShapeData(
                    shapeData,
                ),
            [shapeData],
        );


    const [
        selectedName,
        setSelectedName,
    ] = useState<
        string | null
    >(null);


    const handleGenerate =
        async () => {
            if (!project) {
                return;
            }

            await startStage(
                "shape",
                buildStageInput(
                    project.idea,
                    brand?.data,
                    {},
                    "Turn the accumulated discovery and positioning context into a distinctive brand character. Develop brand personality traits, naming options with reasoning, and a practical brand voice including principles, examples, and sample messages. Keep the outputs coherent with the chosen strategic direction and return structured shape-stage data.",
                ),
            );
        };


    const handleNameSelect =
        (
            option: NamingOption,
        ) => {
            setSelectedName(
                option.name,
            );
        };


    const isRunning =
        submitting ||
        shapeRun?.status ===
        "pending" ||
        shapeRun?.status ===
        "running";


    const hasResult =
        normalized.personality
            .length > 0 ||
        normalized.naming
            .length > 0 ||
        normalized.voicePrinciples
            .length > 0 ||
        normalized.doExamples
            .length > 0 ||
        normalized.dontExamples
            .length > 0 ||
        normalized.sampleMessages
            .length > 0 ||
        Boolean(
            shapeRun?.output_data,
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
                            Stage 03
                        </span>
                    </header>


                    <section
                        className="surface"
                        style={{
                            margin:
                                "56px auto 80px",
                            maxWidth:
                                "860px",
                            minHeight:
                                "420px",
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
                                Stage 03 · Shape
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
                                Loading the brand shape
                            </h1>

                            <p
                                className="muted"
                            >
                                Restoring the strategic
                                context before shaping
                                the brand.
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
                                    )}/positioning`,
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
                                Stage 03 · Shape
                            </span>

                            <h1
                                style={{
                                    maxWidth:
                                        "820px",
                                    fontSize:
                                        "clamp(2.6rem, 5.2vw, 4.7rem)",
                                    lineHeight:
                                        1.04,
                                    letterSpacing:
                                        "-0.055em",
                                }}
                            >
                                Shape the brand.
                            </h1>

                            <p
                                className="muted"
                                style={{
                                    maxWidth:
                                        "680px",
                                    marginTop:
                                        "24px",
                                    fontSize:
                                        "1rem",
                                    lineHeight:
                                        1.75,
                                }}
                            >
                                Turn the chosen
                                strategic direction
                                into personality,
                                naming, and a distinctive
                                voice. This is where the
                                strategy starts becoming
                                recognizable.
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
                                Strategy should
                                become
                                recognizable.
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
                                Personality,
                                naming, and language
                                should reinforce the
                                position established
                                earlier.
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
                                    Brand expression
                                </span>

                                <h2>
                                    Give the strategy a
                                    recognizable
                                    character.
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
                                    Generate brand
                                    personality,
                                    naming options,
                                    and a practical
                                    voice system from
                                    the accumulated
                                    brand context.
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
                                03
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
                                    ? "Brand shaping is running..."
                                    : "Shape the brand →"}
                            </button>

                            <span
                                className="muted small"
                            >
                                Earlier strategic
                                decisions will be
                                carried forward.
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
                                Brand character
                            </span>

                            <h2>
                                Make the strategy
                                recognizable.
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
                                These decisions
                                translate the
                                strategic direction
                                into a brand people
                                can recognize through
                                its behavior, name,
                                and language.
                            </p>
                        </div>


                        <PersonalityCard
                            traits={
                                normalized.personality
                            }
                            avoidTraits={
                                normalized.avoidTraits
                            }
                            rationale={
                                normalized.personalityRationale
                            }
                        />


                        <NamingCard
                            options={
                                normalized.naming
                            }
                            selectedName={
                                selectedName
                            }
                            disabled={
                                isRunning
                            }
                            onSelect={
                                handleNameSelect
                            }
                        />


                        <VoiceCard
                            principles={
                                normalized.voicePrinciples
                            }
                            doExamples={
                                normalized.doExamples
                            }
                            dontExamples={
                                normalized.dontExamples
                            }
                            sampleMessages={
                                normalized.sampleMessages
                            }
                        />


                        {selectedName ? (
                            <div
                                className="surface"
                                style={{
                                    marginTop:
                                        "30px",
                                    padding:
                                        "24px 28px",
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
                                        Naming decision
                                    </span>

                                    <strong
                                        style={{
                                            display:
                                                "block",
                                            fontSize:
                                                "1.2rem",
                                        }}
                                    >
                                        {selectedName}
                                    </strong>

                                    <p
                                        className="muted small"
                                        style={{
                                            marginTop:
                                                "5px",
                                        }}
                                    >
                                        Selected for the
                                        current brand
                                        shape.
                                    </p>
                                </div>


                                <span
                                    className="tag"
                                    style={{
                                        boxShadow:
                                            "var(--small-shadow)",
                                    }}
                                >
                                    Selected
                                </span>

                            </div>
                        ) : null}


                        <div
                            className="stage-navigation"
                            style={{
                                marginTop:
                                    "30px",
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
                                    : "Shape again"}
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
                                        )}/visualize`,
                                    )
                                }
                            >
                                Continue to visual
                                identity →
                            </button>

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
                        Stage 03 · Shape
                    </span>
                </footer>

            </div>
        </main>
    );
}