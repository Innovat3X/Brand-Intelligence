"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import { BrandHeader } from "../../../../components/brand-kit/BrandHeader";
import { BrandStrategy } from "../../../../components/brand-kit/BrandStrategy";
import { BrandVoice } from "../../../../components/brand-kit/BrandVoice";
import {
    LaunchAssets,
    type LaunchAsset,
} from "../../../../components/brand-kit/LaunchAssets";
import { VisualIdentity } from "../../../../components/brand-kit/VisualIdentity";

import { useBrandKit } from "../../../../hooks/useBrandKit";
import { useProject } from "../../../../hooks/useProject";
import { useWorkflow } from "../../../../hooks/useWorkflow";

import {
    getStageData,
    isRecord,
} from "../../../../lib/brand";


type StageData = Record<
    string,
    unknown
>;


type ColorView = {
    name: string;
    hex: string;
    role?: string;
};


type NamingOptionView = {
    name: string;
    rationale?: string;
    territory?: string;
    strengths: string[];
    concerns: string[];
};


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

    return value
        .filter(
            (item): item is string =>
                typeof item === "string" &&
                item.trim().length > 0,
        )
        .map(
            (item) => item.trim(),
        );
}


function readText(
    value: unknown,
): string | undefined {
    if (
        typeof value === "string"
    ) {
        return readString(value);
    }

    if (
        Array.isArray(value)
    ) {
        const values =
            readStrings(value);

        if (
            values.length > 0
        ) {
            return values.join(", ");
        }
    }

    return undefined;
}


function asStageData(
    value: unknown,
): StageData {
    return isRecord(value)
        ? value
        : {};
}


function unwrapWorkflowOutput(
    value: unknown,
): StageData {
    if (!isRecord(value)) {
        return {};
    }

    if (
        isRecord(
            value.result,
        )
    ) {
        return value.result;
    }

    return value;
}


function getSelectedDirection(
    positioningData: unknown,
): StageData {
    const positioning =
        asStageData(
            positioningData,
        );

    const selected =
        [
            positioning.selected_direction,
            positioning.selectedDirection,
            positioning.chosen_direction,
            positioning.chosenDirection,
        ];

    for (
        const candidate of selected
    ) {
        if (
            isRecord(candidate)
        ) {
            return candidate;
        }
    }

    const directions =
        positioning.directions ??
        positioning.positioning_directions ??
        positioning.options;

    if (
        Array.isArray(directions)
    ) {
        const first =
            directions.find(
                isRecord,
            );

        if (first) {
            return first;
        }
    }

    return {};
}


function getPersonality(
    shapeData: unknown,
): {
    traits: string[];
    avoidTraits: string[];
} {
    const shape =
        asStageData(
            shapeData,
        );

    const personality =
        asStageData(
            shape.personality,
        );

    return {
        traits:
            readStrings(
                personality.traits ??
                personality.attributes ??
                shape.traits,
            ),

        avoidTraits:
            readStrings(
                personality.avoid_traits ??
                personality.avoidTraits ??
                shape.avoid_traits ??
                shape.traits_to_avoid,
            ),
    };
}


function getVoice(
    shapeData: unknown,
): {
    principles: string[];
    doExamples: string[];
    dontExamples: string[];
} {
    const shape =
        asStageData(
            shapeData,
        );

    const voice =
        asStageData(
            shape.voice,
        );

    return {
        principles:
            readStrings(
                voice.principles ??
                voice.voice_principles ??
                shape.voice_principles,
            ),

        doExamples:
            readStrings(
                voice.do_examples ??
                voice.doExamples ??
                voice.do,
            ),

        dontExamples:
            readStrings(
                voice.dont_examples ??
                voice.dontExamples ??
                voice.avoid,
            ),
    };
}


function getVisualIdentity(
    visualizeData: unknown,
): {
    direction?: string;
    typography: string[];
    imagery: string[];
    colors: ColorView[];
} {
    const visualize =
        asStageData(
            visualizeData,
        );

    const visual =
        isRecord(
            visualize.visual,
        )
            ? visualize.visual
            : visualize;

    const rawTypography =
        Array.isArray(
            visual.typography,
        )
            ? visual.typography
            : [];

    const typography =
        rawTypography
            .filter(isRecord)
            .map(
                (
                    item,
                ): string | undefined => {
                    const name =
                        readString(
                            item.name,
                        ) ??
                        readString(
                            item.font,
                        );

                    if (!name) {
                        return undefined;
                    }

                    const role =
                        readString(
                            item.role,
                        );

                    const style =
                        readString(
                            item.style,
                        );

                    if (
                        role &&
                        style
                    ) {
                        return `${name} — ${role} — ${style}`;
                    }

                    if (role) {
                        return `${name} — ${role}`;
                    }

                    if (style) {
                        return `${name} — ${style}`;
                    }

                    return name;
                },
            )
            .filter(
                (
                    item,
                ): item is string =>
                    Boolean(item),
            );

    const rawColors =
        Array.isArray(
            visual.colors,
        )
            ? visual.colors
            : [];

    const colors =
        rawColors
            .filter(isRecord)
            .map(
                (
                    color,
                    index,
                ): ColorView => ({
                    name:
                        readString(
                            color.name,
                        ) ??
                        `Color ${index + 1}`,

                    hex:
                        readString(
                            color.hex,
                        ) ??
                        readString(
                            color.value,
                        ) ??
                        "#000000",

                    role:
                        readString(
                            color.role,
                        ),
                }),
            );

    return {
        direction:
            readString(
                visual.direction,
            ) ??
            readString(
                visual.visual_direction,
            ),

        typography,

        imagery:
            readStrings(
                visual.imagery,
            ),

        colors,
    };
}


function getNamingOptions(
    shapeData: unknown,
): NamingOptionView[] {
    const shape =
        asStageData(
            shapeData,
        );

    const naming =
        asStageData(
            shape.naming,
        );

    const rawOptions =
        Array.isArray(
            naming.options,
        )
            ? naming.options
            : Array.isArray(
                shape.naming_options,
            )
                ? shape.naming_options
                : [];

    return rawOptions
        .filter(isRecord)
        .map(
            (
                option,
            ): NamingOptionView => ({
                name:
                    readString(
                        option.name,
                    ) ??
                    readString(
                        option.title,
                    ) ??
                    "Untitled option",

                rationale:
                    readString(
                        option.rationale,
                    ) ??
                    readString(
                        option.reasoning,
                    ),

                territory:
                    readString(
                        option.territory,
                    ),

                strengths:
                    readStrings(
                        option.strengths,
                    ),

                concerns:
                    readStrings(
                        option.concerns,
                    ),
            }),
        );
}


function getChallenge(
    challengeData: unknown,
) {
    const challenge =
        asStageData(
            challengeData,
        );

    const rawIssues =
        challenge.issues ??
        challenge.risks;

    const issues =
        Array.isArray(
            rawIssues,
        )
            ? rawIssues
                .filter(isRecord)
                .map(
                    (
                        item,
                    ) => ({
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
                            "Review this area before launch.",

                        severity:
                            readString(
                                item.severity,
                            ),
                    }),
                )
            : [];

    return {
        summary:
            readString(
                challenge.summary,
            ) ??
            readString(
                challenge.overall_assessment,
            ),

        issues,

        strengths:
            readStrings(
                challenge.strengths,
            ),

        recommendations:
            readStrings(
                challenge.recommendations,
            ),
    };
}


export default function BrandKitPage() {
    const router =
        useRouter();

    const params =
        useParams<{
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
    } =
        useProject(
            projectId,
        );


    const {
        brand,
        loading:
        brandLoading,
        error:
        brandError,
    } =
        useBrandKit(
            projectId,
        );


    const {
        latestRun,
    } =
        useWorkflow(
            projectId,
        );


    /*
     * First use the latest workflow result.
     * Fall back to persisted brand state.
     */
    const discoveryData =
        useMemo(() => {
            const run =
                latestRun(
                    "discovery",
                );

            if (
                run?.output_data
            ) {
                return unwrapWorkflowOutput(
                    run.output_data,
                );
            }

            return asStageData(
                getStageData(
                    brand?.data,
                    "discovery",
                ),
            );
        }, [
            latestRun,
            brand?.data,
        ]);


    const positioningData =
        useMemo(() => {
            const run =
                latestRun(
                    "positioning",
                );

            if (
                run?.output_data
            ) {
                return unwrapWorkflowOutput(
                    run.output_data,
                );
            }

            return asStageData(
                getStageData(
                    brand?.data,
                    "positioning",
                ),
            );
        }, [
            latestRun,
            brand?.data,
        ]);


    const shapeData =
        useMemo(() => {
            const run =
                latestRun(
                    "shape",
                );

            if (
                run?.output_data
            ) {
                return unwrapWorkflowOutput(
                    run.output_data,
                );
            }

            return asStageData(
                getStageData(
                    brand?.data,
                    "shape",
                ),
            );
        }, [
            latestRun,
            brand?.data,
        ]);


    const visualizeData =
        useMemo(() => {
            const run =
                latestRun(
                    "visualize",
                );

            if (
                run?.output_data
            ) {
                return unwrapWorkflowOutput(
                    run.output_data,
                );
            }

            return asStageData(
                getStageData(
                    brand?.data,
                    "visualize",
                ),
            );
        }, [
            latestRun,
            brand?.data,
        ]);


    const challengeData =
        useMemo(() => {
            const run =
                latestRun(
                    "challenge",
                );

            if (
                run?.output_data
            ) {
                return unwrapWorkflowOutput(
                    run.output_data,
                );
            }

            return asStageData(
                getStageData(
                    brand?.data,
                    "challenge",
                ),
            );
        }, [
            latestRun,
            brand?.data,
        ]);


    const assembled =
        useMemo(() => {
            const discovery =
                asStageData(
                    discoveryData,
                );

            const positioning =
                asStageData(
                    positioningData,
                );

            const shape =
                asStageData(
                    shapeData,
                );

            const direction =
                getSelectedDirection(
                    positioning,
                );

            const personality =
                getPersonality(
                    shape,
                );

            const voice =
                getVoice(
                    shape,
                );

            const visual =
                getVisualIdentity(
                    visualizeData,
                );

            const challenge =
                getChallenge(
                    challengeData,
                );

            const namingOptions =
                getNamingOptions(
                    shape,
                );


            const brandName =
                readString(
                    shape.brand_name,
                ) ??
                readString(
                    shape.brandName,
                ) ??
                namingOptions[0]
                    ?.name ??
                project?.name ??
                "Untitled brand";


            const positioningText =
                readString(
                    direction.positioning,
                ) ??
                readString(
                    direction.title,
                ) ??
                readString(
                    direction.name,
                ) ??
                readString(
                    direction.description,
                );


            const audience =
                readText(
                    direction.audience,
                ) ??
                readText(
                    direction.target_audience,
                ) ??
                readText(
                    discovery.target_users,
                ) ??
                readText(
                    discovery.user_segments,
                );


            const valueProposition =
                readString(
                    direction.value_proposition,
                ) ??
                readString(
                    direction.valueProposition,
                ) ??
                readString(
                    direction.value,
                ) ??
                readString(
                    direction.promise,
                );


            const differentiation =
                readString(
                    direction.differentiator,
                ) ??
                readString(
                    direction.differentiation,
                );


            const summary =
                readString(
                    discovery.problem,
                ) ??
                readString(
                    discovery.context,
                ) ??
                readString(
                    discovery.key_insight,
                ) ??
                readString(
                    challenge.summary,
                );


            const generatedAssets:
                LaunchAsset[] = [];


            if (
                positioningText ||
                audience ||
                valueProposition ||
                differentiation
            ) {
                generatedAssets.push({
                    name:
                        "Brand strategy sheet",

                    description:
                        "Positioning, audience, value proposition, and differentiation assembled from the workflow.",

                    priority:
                        "now",
                });
            }


            if (
                personality.traits.length > 0 ||
                voice.principles.length > 0 ||
                namingOptions.length > 0
            ) {
                generatedAssets.push({
                    name:
                        "Brand expression guide",

                    description:
                        "Personality, naming, and voice decisions assembled from Shape.",

                    priority:
                        "now",
                });
            }


            if (
                visual.direction ||
                visual.colors.length > 0 ||
                visual.typography.length > 0 ||
                visual.imagery.length > 0
            ) {
                generatedAssets.push({
                    name:
                        "Visual identity reference",

                    description:
                        "Visual direction, palette, typography, and imagery assembled from Visualize.",

                    priority:
                        "now",
                });
            }


            if (
                challenge.recommendations.length > 0
            ) {
                generatedAssets.push({
                    name:
                        "Challenge action list",

                    description:
                        "Recommended actions carried forward from Challenge.",

                    priority:
                        "next",
                });
            }


            return {
                name:
                    brandName,

                tagline:
                    readString(
                        shape.tagline,
                    ),

                summary,

                positioning:
                    positioningText,

                audience,

                valueProposition,

                differentiation,

                promise:
                    readString(
                        direction.promise,
                    ),

                personality:
                    personality.traits,

                voicePrinciples:
                    voice.principles,

                doExamples:
                    voice.doExamples,

                dontExamples:
                    voice.dontExamples,

                visualDirection:
                    visual.direction,

                typography:
                    visual.typography,

                imagery:
                    visual.imagery,

                colors:
                    visual.colors,

                assets:
                    generatedAssets,

                namingOptions,

                challenge,
            };
        }, [
            discoveryData,
            positioningData,
            shapeData,
            visualizeData,
            challengeData,
            project?.name,
        ]);


    if (
        projectLoading ||
        brandLoading
    ) {
        return (
            <section className="stage-page">
                <div className="stage-loading">

                    <span className="section-eyebrow">
                        Stage 06 · Deliver
                    </span>

                    <h1>
                        Assembling your brand kit…
                    </h1>

                    <p>
                        Bringing the strategic,
                        verbal, visual, and challenge
                        decisions together.
                    </p>

                </div>
            </section>
        );
    }


    if (!project) {
        return (
            <section className="stage-page">
                <div className="stage-error">

                    <span className="section-eyebrow">
                        Project unavailable
                    </span>

                    <h1>
                        We could not load this project.
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


    return (
        <section className="stage-page">

            <div className="stage-hero">

                <div>

                    <span className="section-eyebrow">
                        Stage 06 · Deliver
                    </span>

                    <h1>
                        Your launch-ready brand system.
                    </h1>

                    <p>
                        The decisions from the entire
                        workflow are assembled here into
                        one practical brand kit.
                    </p>

                </div>


                <div className="stage-principle">

                    <span>
                        Principle
                    </span>

                    <strong>
                        Turn connected decisions into a
                        usable system.
                    </strong>

                </div>

            </div>


            {brandError ? (
                <div
                    className="form-error"
                    role="alert"
                >
                    {brandError}
                </div>
            ) : null}


            <BrandHeader
                name={
                    assembled.name
                }
                tagline={
                    assembled.tagline
                }
                summary={
                    assembled.summary
                }
            />


            <BrandStrategy
                positioning={
                    assembled.positioning
                }
                audience={
                    assembled.audience
                }
                valueProposition={
                    assembled.valueProposition
                }
                differentiation={
                    assembled.differentiation
                }
                promise={
                    assembled.promise
                }
            />


            <BrandVoice
                personality={
                    assembled.personality
                }
                principles={
                    assembled.voicePrinciples
                }
                doExamples={
                    assembled.doExamples
                }
                dontExamples={
                    assembled.dontExamples
                }
            />


            <VisualIdentity
                direction={
                    assembled.visualDirection
                }
                colors={
                    assembled.colors
                }
                typography={
                    assembled.typography
                }
                imagery={
                    assembled.imagery
                }
            />


            {assembled.namingOptions.length > 0 ? (
                <section
                    className="stage-card"
                >

                    <div
                        className="stage-card-header"
                    >

                        <div>

                            <span
                                className="section-eyebrow"
                            >
                                Naming exploration
                            </span>

                            <h2>
                                Names generated during
                                Shape.
                            </h2>

                        </div>


                        <span
                            className="stage-card-index"
                        >
                            {
                                assembled
                                    .namingOptions
                                    .length
                            }
                        </span>

                    </div>


                    <div
                        className="brand-strategy-grid"
                    >
                        {assembled.namingOptions.map(
                            (
                                option,
                                index,
                            ) => (
                                <article
                                    key={`${option.name}-${index}`}
                                    className="brand-strategy-item"
                                >

                                    <span
                                        className="positioning-detail-label"
                                    >
                                        Option {index + 1}
                                    </span>

                                    <h3>
                                        {
                                            option.name
                                        }
                                    </h3>

                                    {option.rationale ? (
                                        <p>
                                            {
                                                option.rationale
                                            }
                                        </p>
                                    ) : null}

                                    {option.territory ? (
                                        <p
                                            className="muted small"
                                        >
                                            Territory: {
                                                option.territory
                                            }
                                        </p>
                                    ) : null}

                                    {option.strengths.length > 0 ? (
                                        <ul
                                            className="result-list"
                                        >
                                            {option.strengths.map(
                                                (
                                                    item,
                                                    strengthIndex,
                                                ) => (
                                                    <li
                                                        key={`${item}-${strengthIndex}`}
                                                    >
                                                        {item}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    ) : null}

                                </article>
                            ),
                        )}
                    </div>

                </section>
            ) : null}


            {assembled.challenge.summary ||
                assembled.challenge.issues.length > 0 ||
                assembled.challenge.strengths.length > 0 ||
                assembled.challenge.recommendations.length > 0 ? (
                <section
                    className="stage-card"
                >

                    <div
                        className="stage-card-header"
                    >

                        <div>

                            <span
                                className="section-eyebrow"
                            >
                                Challenge review
                            </span>

                            <h2>
                                What needs attention
                                before launch?
                            </h2>

                        </div>


                        <span
                            className="stage-card-index"
                        >
                            {
                                assembled.challenge
                                    .issues.length
                            }
                        </span>

                    </div>


                    {assembled.challenge.summary ? (
                        <p
                            className="stage-card-description"
                        >
                            {
                                assembled.challenge.summary
                            }
                        </p>
                    ) : null}


                    {assembled.challenge.issues.length > 0 ? (
                        <div
                            className="brand-strategy-grid"
                        >
                            {assembled.challenge.issues.map(
                                (
                                    issue,
                                    index,
                                ) => (
                                    <article
                                        key={`${issue.title}-${index}`}
                                        className="brand-strategy-item"
                                    >

                                        <span
                                            className="positioning-detail-label"
                                        >
                                            {
                                                issue.severity ??
                                                "Issue"
                                            }
                                        </span>

                                        <h3>
                                            {
                                                issue.title
                                            }
                                        </h3>

                                        <p>
                                            {
                                                issue.description
                                            }
                                        </p>

                                    </article>
                                ),
                            )}
                        </div>
                    ) : null}


                    {assembled.challenge.strengths.length > 0 ? (
                        <div
                            className="brand-kit-section"
                        >

                            <span
                                className="positioning-detail-label"
                            >
                                Strengths
                            </span>

                            <ul
                                className="result-list"
                            >
                                {assembled.challenge.strengths.map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <li
                                            key={`${item}-${index}`}
                                        >
                                            {item}
                                        </li>
                                    ),
                                )}
                            </ul>

                        </div>
                    ) : null}


                    {assembled.challenge.recommendations.length > 0 ? (
                        <div
                            className="brand-kit-section"
                        >

                            <span
                                className="positioning-detail-label"
                            >
                                Recommended actions
                            </span>

                            <ol
                                className="result-list result-list-numbered"
                            >
                                {assembled.challenge.recommendations.map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <li
                                            key={`${item}-${index}`}
                                        >
                                            {item}
                                        </li>
                                    ),
                                )}
                            </ol>

                        </div>
                    ) : null}

                </section>
            ) : null}


            <LaunchAssets
                assets={
                    assembled.assets
                }
            />


            <footer
                className="site-footer"
            >

                <span>
                    Brand Intelligence
                </span>

                <span>
                    Stage 06 · Deliver
                </span>

            </footer>

        </section>
    );
}