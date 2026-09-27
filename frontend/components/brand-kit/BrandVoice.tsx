"use client";

interface BrandVoiceProps {
    personality?: string[];
    principles?: string[];
    doExamples?: string[];
    dontExamples?: string[];
}

export function BrandVoice({
    personality = [],
    principles = [],
    doExamples = [],
    dontExamples = [],
}: BrandVoiceProps) {
    const visiblePersonality = personality.filter(
        (trait) => trait.trim().length > 0,
    );

    const visiblePrinciples = principles.filter(
        (principle) => principle.trim().length > 0,
    );

    const visibleDoExamples = doExamples.filter(
        (example) => example.trim().length > 0,
    );

    const visibleDontExamples = dontExamples.filter(
        (example) => example.trim().length > 0,
    );

    const hasContent =
        visiblePersonality.length > 0 ||
        visiblePrinciples.length > 0 ||
        visibleDoExamples.length > 0 ||
        visibleDontExamples.length > 0;

    return (
        <section
            className="surface"
            style={{
                marginTop: "30px",
                padding: "32px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "24px",
                }}
            >
                <div>
                    <span className="eyebrow">
                        Brand voice
                    </span>

                    <h2>
                        How the brand communicates.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        The language system that turns the brand
                        personality into consistent communication.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${visiblePrinciples.length} voice principles`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow:
                            "var(--small-shadow)",
                    }}
                >
                    {visiblePrinciples.length}
                </span>
            </div>

            {!hasContent ? (
                <div
                    style={{
                        marginTop: "26px",
                        padding: "24px",
                        borderRadius: "14px",
                        background: "var(--bg)",
                        boxShadow:
                            "var(--inset-shadow)",
                        textAlign: "center",
                    }}
                >
                    <p className="muted">
                        No voice decisions have been assembled yet.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gap: "24px",
                        marginTop: "28px",
                    }}
                >
                    {visiblePersonality.length > 0 ? (
                        <div
                            style={{
                                padding: "22px",
                                borderRadius: "15px",
                                background:
                                    "var(--bg)",
                                boxShadow:
                                    "var(--raised)",
                                border:
                                    "1px solid #ffffff99",
                            }}
                        >
                            <span className="eyebrow">
                                Personality
                            </span>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexWrap:
                                        "wrap",
                                    gap: "10px",
                                    marginTop:
                                        "14px",
                                }}
                            >
                                {visiblePersonality.map(
                                    (trait) => (
                                        <span
                                            key={trait}
                                            className="tag"
                                            style={{
                                                boxShadow:
                                                    "var(--small-shadow)",
                                            }}
                                        >
                                            {trait}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : null}

                    {visiblePrinciples.length > 0 ? (
                        <div
                            style={{
                                padding: "22px",
                                borderRadius: "15px",
                                background:
                                    "var(--bg)",
                                boxShadow:
                                    "var(--raised)",
                                border:
                                    "1px solid #ffffff99",
                            }}
                        >
                            <span className="eyebrow">
                                Voice principles
                            </span>

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gap:
                                        "12px",
                                    marginTop:
                                        "14px",
                                }}
                            >
                                {visiblePrinciples.map(
                                    (
                                        principle,
                                        index,
                                    ) => (
                                        <article
                                            key={`${principle}-${index}`}
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "flex-start",
                                                gap:
                                                    "13px",
                                                padding:
                                                    "15px 16px",
                                                borderRadius:
                                                    "12px",
                                                background:
                                                    "var(--bg)",
                                                boxShadow:
                                                    "var(--inset-shadow)",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display:
                                                        "grid",
                                                    width:
                                                        "32px",
                                                    height:
                                                        "32px",
                                                    flexShrink:
                                                        0,
                                                    placeItems:
                                                        "center",
                                                    borderRadius:
                                                        "9px",
                                                    background:
                                                        "var(--accent-soft)",
                                                    color:
                                                        "var(--accent-dark)",
                                                    fontSize:
                                                        "0.67rem",
                                                    fontWeight:
                                                        750,
                                                }}
                                            >
                                                {String(
                                                    index +
                                                    1,
                                                ).padStart(
                                                    2,
                                                    "0",
                                                )}
                                            </span>

                                            <p
                                                style={{
                                                    paddingTop:
                                                        "3px",
                                                    fontSize:
                                                        "0.82rem",
                                                    lineHeight:
                                                        1.65,
                                                }}
                                            >
                                                {principle}
                                            </p>
                                        </article>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : null}

                    {visibleDoExamples.length > 0 ||
                        visibleDontExamples.length > 0 ? (
                        <div
                            style={{
                                display:
                                    "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(250px, 1fr))",
                                gap:
                                    "20px",
                            }}
                        >
                            {visibleDoExamples.length > 0 ? (
                                <div
                                    style={{
                                        padding:
                                            "22px",
                                        borderRadius:
                                            "15px",
                                        background:
                                            "var(--bg)",
                                        boxShadow:
                                            "var(--raised)",
                                        border:
                                            "1px solid #ffffff99",
                                    }}
                                >
                                    <span className="eyebrow">
                                        Do
                                    </span>

                                    <ul
                                        style={{
                                            display:
                                                "grid",
                                            gap:
                                                "10px",
                                            margin:
                                                "14px 0 0",
                                            paddingLeft:
                                                "18px",
                                        }}
                                    >
                                        {visibleDoExamples.map(
                                            (
                                                example,
                                            ) => (
                                                <li
                                                    key={
                                                        example
                                                    }
                                                    style={{
                                                        fontSize:
                                                            "0.8rem",
                                                        lineHeight:
                                                            1.6,
                                                    }}
                                                >
                                                    {
                                                        example
                                                    }
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            ) : null}

                            {visibleDontExamples.length > 0 ? (
                                <div
                                    style={{
                                        padding:
                                            "22px",
                                        borderRadius:
                                            "15px",
                                        background:
                                            "var(--bg)",
                                        boxShadow:
                                            "var(--raised)",
                                        border:
                                            "1px solid #ffffff99",
                                    }}
                                >
                                    <span className="eyebrow">
                                        Avoid
                                    </span>

                                    <ul
                                        style={{
                                            display:
                                                "grid",
                                            gap:
                                                "10px",
                                            margin:
                                                "14px 0 0",
                                            paddingLeft:
                                                "18px",
                                        }}
                                    >
                                        {visibleDontExamples.map(
                                            (
                                                example,
                                            ) => (
                                                <li
                                                    key={
                                                        example
                                                    }
                                                    className="muted"
                                                    style={{
                                                        fontSize:
                                                            "0.8rem",
                                                        lineHeight:
                                                            1.6,
                                                    }}
                                                >
                                                    {
                                                        example
                                                    }
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            )}
        </section>
    );
}