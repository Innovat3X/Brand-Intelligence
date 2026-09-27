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

function readPriority(
    value: unknown,
): LaunchAsset["priority"] {
    if (
        value === "now" ||
        value === "next" ||
        value === "later"
    ) {
        return value;
    }

    return undefined;
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
        active: true,
    },
];

export default function BrandKitPage() {
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

    const deliverData =
        getStageData(
            brand?.data,
            "deliver",
        );

    const assembled = useMemo(() => {
        if (!isRecord(deliverData)) {
            return {
                name:
                    project?.name ??
                    "Untitled brand",

                tagline: undefined,
                summary: undefined,

                positioning: undefined,
                audience: undefined,
                valueProposition:
                    undefined,
                differentiation:
                    undefined,
                promise: undefined,

                personality:
                    [] as string[],
                voicePrinciples:
                    [] as string[],
                doExamples:
                    [] as string[],
                dontExamples:
                    [] as string[],

                visualDirection:
                    undefined,
                typography:
                    [] as string[],
                imagery:
                    [] as string[],

                colors:
                    [] as Array<{
                        name: string;
                        hex: string;
                        role?: string;
                    }>,

                assets:
                    [] as LaunchAsset[],
            };
        }

        const strategy =
            isRecord(
                deliverData.strategy,
            )
                ? deliverData.strategy
                : deliverData;

        const voice =
            isRecord(
                deliverData.voice,
            )
                ? deliverData.voice
                : {};

        const visual =
            isRecord(
                deliverData.visual_identity,
            )
                ? deliverData.visual_identity
                : isRecord(
                    deliverData.visual,
                )
                    ? deliverData.visual
                    : {};

        const rawColors =
            Array.isArray(
                visual.colors,
            )
                ? visual.colors
                : [];

        const colors =
            rawColors
                .filter(isRecord)
                .map((color) => ({
                    name:
                        readString(
                            color.name,
                        ) ??
                        "Untitled color",

                    hex:
                        readString(
                            color.hex,
                        ) ??
                        "#000000",

                    role: readString(
                        color.role,
                    ),
                }));

        const rawAssets =
            Array.isArray(
                deliverData.launch_assets,
            )
                ? deliverData.launch_assets
                : [];

        const assets: LaunchAsset[] =
            rawAssets
                .filter(isRecord)
                .map(
                    (
                        asset,
                    ): LaunchAsset => ({
                        name:
                            readString(
                                asset.name,
                            ) ??
                            "Launch asset",

                        description:
                            readString(
                                asset.description,
                            ) ?? "",

                        priority:
                            readPriority(
                                asset.priority,
                            ),
                    }),
                );

        return {
            name:
                readString(
                    deliverData.name,
                ) ??
                readString(
                    deliverData.brand_name,
                ) ??
                project?.name ??
                "Untitled brand",

            tagline:
                readString(
                    deliverData.tagline,
                ) ??
                readString(
                    deliverData.tag_line,
                ),

            summary:
                readString(
                    deliverData.summary,
                ) ??
                readString(
                    deliverData.brand_summary,
                ),

            positioning:
                readString(
                    strategy.positioning,
                ),

            audience:
                readString(
                    strategy.audience,
                ) ??
                readString(
                    strategy.target_audience,
                ),

            valueProposition:
                readString(
                    strategy.value_proposition,
                ) ??
                readString(
                    strategy.valueProposition,
                ),

            differentiation:
                readString(
                    strategy.differentiation,
                ),

            promise:
                readString(
                    strategy.promise,
                ) ??
                readString(
                    strategy.brand_promise,
                ),

            personality:
                readStrings(
                    deliverData.personality,
                ),

            voicePrinciples:
                readStrings(
                    voice.principles,
                ),

            doExamples:
                readStrings(
                    voice.do_examples,
                ),

            dontExamples:
                readStrings(
                    voice.dont_examples,
                ),

            visualDirection:
                readString(
                    visual.direction,
                ) ??
                readString(
                    visual.visual_direction,
                ),

            typography:
                readStrings(
                    visual.typography,
                ),

            imagery:
                readStrings(
                    visual.imagery,
                ),

            colors,

            assets,
        };
    }, [
        deliverData,
        project?.name,
    ]);

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
                            Stage 06
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
                                Stage 06 · Deliver
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
                                Assembling your brand kit
                            </h1>

                            <p className="muted">
                                Bringing the strategic,
                                verbal, and visual
                                decisions together.
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
                            gap:
                                "12px",
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
                                    )}/challenge`,
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
                                Stage 06 · Deliver
                            </span>

                            <h1
                                style={{
                                    maxWidth:
                                        "900px",
                                    fontSize:
                                        "clamp(2.6rem, 5.2vw, 4.7rem)",
                                    lineHeight:
                                        1.04,
                                    letterSpacing:
                                        "-0.055em",
                                }}
                            >
                                Your launch-ready
                                brand system.
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
                                The decisions from the
                                workflow are assembled here
                                into one practical brand kit.
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
                                Turn connected decisions
                                into a usable system.
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
                                Strategy, expression,
                                visual identity, and launch
                                considerations come
                                together here.
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

                {brandError ? (
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
                                The brand kit could not be
                                fully loaded.
                            </strong>

                            <p>
                                {brandError}
                            </p>
                        </div>
                    </div>
                ) : null}

                <section
                    style={{
                        display:
                            "grid",
                        gap:
                            "30px",
                        paddingBottom:
                            "80px",
                    }}
                >
                    <div
                        className="surface"
                        style={{
                            padding:
                                "18px 24px",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap:
                                "14px",
                        }}
                    >
                        <span
                            style={{
                                display:
                                    "grid",
                                width:
                                    "38px",
                                height:
                                    "38px",
                                flexShrink:
                                    0,
                                placeItems:
                                    "center",
                                borderRadius:
                                    "11px",
                                background:
                                    "var(--accent-soft)",
                                color:
                                    "var(--accent-dark)",
                                boxShadow:
                                    "var(--small-shadow)",
                                fontSize:
                                    "0.75rem",
                                fontWeight:
                                    800,
                            }}
                        >
                            ✓
                        </span>

                        <div>
                            <strong>
                                Brand system assembled
                            </strong>

                            <p className="muted small">
                                The following sections bring
                                together the decisions made
                                throughout the workflow.
                            </p>
                        </div>
                    </div>

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

                    <LaunchAssets
                        assets={
                            assembled.assets
                        }
                    />

                    <div
                        className="surface"
                        style={{
                            padding:
                                "28px 30px",
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
                                Workflow complete
                            </span>

                            <h3>
                                Your brand system is ready
                                to review and use.
                            </h3>

                            <p
                                className="muted small"
                                style={{
                                    marginTop:
                                        "6px",
                                }}
                            >
                                All available decisions have
                                been assembled into this
                                brand kit.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="button primary"
                            onClick={() =>
                                router.push(
                                    `/project/${encodeURIComponent(
                                        project.id,
                                    )}/discovery`,
                                )
                            }
                        >
                            Review workflow →
                        </button>
                    </div>
                </section>

                <footer className="site-footer">
                    <span>
                        Brand Intelligence
                    </span>

                    <span>
                        Stage 06 · Deliver
                    </span>
                </footer>
            </div>
        </main>
    );
}