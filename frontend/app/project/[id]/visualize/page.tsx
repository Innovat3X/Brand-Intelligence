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

                role:
                    readString(item.role),

                rationale:
                    readString(
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

                rationale:
                    readString(
                        item.rationale,
                    ),

                style:
                    readString(
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
            direction:
                undefined as
                | string
                | undefined,

            keywords:
                [] as string[],

            imagery:
                [] as string[],

            principles:
                [] as string[],

            colors:
                [] as ColorSwatch[],

            typography:
                [] as TypographyChoice[],
        };
    }

    const visual =
        isRecord(value.visual)
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

        keywords:
            readStrings(
                visual.keywords,
            ),

        imagery:
            readStrings(
                visual.imagery,
            ),

        principles,

        colors:
            normalizeColors(
                visual.colors,
            ),

        typography:
            normalizeTypography(
                visual.typography,
            ),
    };
}


/*
 * AIML workflow response:
 *
 * {
 *   "result": {
 *      ...
 *   }
 * }
 *
 * Unwrap it before rendering.
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
        active: false,
    },
    {
        number: "04",
        title: "Visualize",
        description:
            "Explore the visual identity",
        active: true,
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


export default function VisualizePage() {
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


    const visualizeRun =
        latestRun("visualize");


    /*
     * Prefer the newest workflow result.
     * Fall back to stored brand data when
     * revisiting the page.
     */
    const visualizeData:
        Record<string, unknown> =
        useMemo(() => {
            if (
                visualizeRun?.output_data
            ) {
                return unwrapWorkflowOutput(
                    visualizeRun.output_data,
                );
            }

            const stored =
                getStageData(
                    brand?.data,
                    "visualize",
                );

            return isRecord(stored)
                ? stored
                : {};
        }, [
            visualizeRun?.output_data,
            brand?.data,
        ]);


    const normalized =
        useMemo(
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
            <section className="stage-page">
                <div className="stage-loading">

                    <span
                        className="section-eyebrow"
                    >
                        Stage 04 · Visualize
                    </span>

                    <h1>
                        Loading visual identity…
                    </h1>

                    <p>
                        Restoring the brand context
                        before developing the visual
                        system.
                    </p>

                </div>
            </section>
        );
    }


    if (!project) {
        return (
            <section className="stage-page">
                <div className="stage-error">

                    <span
                        className="section-eyebrow"
                    >
                        Project unavailable
                    </span>

                    <h1>
                        We could not load this
                        project.
                    </h1>

                    <p>
                        {projectError ??
                            "The requested project could not be found."}
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            router.push("/")
                        }
                    >
                        Back to home
                    </button>

                </div>
            </section>
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
        normalized.keywords.length > 0 ||
        normalized.imagery.length > 0 ||
        normalized.principles.length > 0 ||
        normalized.colors.length > 0 ||
        normalized.typography.length > 0;


    return (
        <section className="stage-page">

            <div className="stage-hero">

                <div>

                    <span
                        className="section-eyebrow"
                    >
                        Stage 04 · Visualize
                    </span>

                    <h1>
                        Build the visual identity.
                    </h1>

                    <p>
                        Translate the strategy into a
                        visual system that feels coherent,
                        distinctive, and useful beyond a
                        single mockup.
                    </p>

                </div>


                <div className="stage-principle">

                    <span>
                        Principle
                    </span>

                    <strong>
                        Make the visual system
                        reinforce the strategy.
                    </strong>

                </div>

            </div>


            {workflowError ||
                brandError ? (
                <div
                    className="form-error"
                    role="alert"
                >
                    {workflowError ??
                        brandError}
                </div>
            ) : null}


            {!hasResult ? (

                <section className="stage-card">

                    <div className="stage-card-header">

                        <div>

                            <span
                                className="section-eyebrow"
                            >
                                Visual system
                            </span>

                            <h2>
                                Translate the brand
                                into design.
                            </h2>

                        </div>

                        <span
                            className="stage-card-index"
                        >
                            04
                        </span>

                    </div>


                    <p className="stage-card-description">
                        Generate a visual direction,
                        color system, typography
                        direction, imagery guidance,
                        and design principles from
                        the accumulated brand context.
                    </p>


                    <button
                        type="button"
                        className="primary-button"
                        disabled={isRunning}
                        onClick={
                            handleGenerate
                        }
                    >
                        {isRunning
                            ? "Visual identity is running..."
                            : "Build visual identity →"}
                    </button>

                </section>

            ) : (

                <>

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
                        className="stage-actions"
                    >

                        <button
                            type="button"
                            className="secondary-button"
                            disabled={isRunning}
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
                            className="primary-button"
                            disabled={isRunning}
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

                </>

            )}

        </section>
    );
}