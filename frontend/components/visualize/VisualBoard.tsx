"use client";

interface VisualBoardProps {
    direction?: string;
    keywords?: string[];
    imagery?: string[];
    principles?: string[];
}

export function VisualBoard({
    direction,
    keywords = [],
    imagery = [],
    principles = [],
}: VisualBoardProps) {
    const visibleKeywords = keywords.filter(
        (keyword) => keyword.trim().length > 0,
    );

    const visibleImagery = imagery.filter(
        (item) => item.trim().length > 0,
    );

    const visiblePrinciples = principles.filter(
        (principle) => principle.trim().length > 0,
    );

    const hasVisualContent =
        Boolean(direction?.trim()) ||
        visibleKeywords.length > 0 ||
        visibleImagery.length > 0 ||
        visiblePrinciples.length > 0;

    return (
        <section
            className="surface"
            style={{
                padding: "32px",
                marginTop: "30px",
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
                        Visual direction
                    </span>

                    <h2>
                        What should the brand feel like?
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        Translate the strategic direction into
                        visual cues, imagery, keywords, and design
                        principles.
                    </p>
                </div>

                <span
                    className="preview-number"
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow: "var(--small-shadow)",
                    }}
                >
                    04
                </span>
            </div>

            {!hasVisualContent ? (
                <div
                    style={{
                        marginTop: "26px",
                        padding: "24px",
                        borderRadius: "14px",
                        background: "var(--bg)",
                        boxShadow: "var(--inset-shadow)",
                        textAlign: "center",
                    }}
                >
                    <p className="muted">
                        No visual direction has been generated yet.
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
                    {direction ? (
                        <div
                            style={{
                                padding: "22px",
                                borderRadius: "15px",
                                background: "var(--bg)",
                                boxShadow: "var(--inset-shadow)",
                            }}
                        >
                            <span className="eyebrow">
                                Creative direction
                            </span>

                            <p
                                style={{
                                    marginTop: "8px",
                                    fontSize: "0.95rem",
                                    lineHeight: 1.75,
                                }}
                            >
                                {direction}
                            </p>
                        </div>
                    ) : null}

                    {visibleKeywords.length > 0 ? (
                        <div
                            style={{
                                padding: "22px",
                                borderRadius: "15px",
                                background: "var(--bg)",
                                boxShadow: "var(--raised)",
                                border: "1px solid #ffffff99",
                            }}
                        >
                            <span className="eyebrow">
                                Visual keywords
                            </span>

                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    marginTop: "14px",
                                }}
                            >
                                {visibleKeywords.map(
                                    (keyword) => (
                                        <span
                                            key={keyword}
                                            className="tag"
                                            style={{
                                                boxShadow:
                                                    "var(--small-shadow)",
                                            }}
                                        >
                                            {keyword}
                                        </span>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : null}

                    {visibleImagery.length > 0 ? (
                        <div
                            style={{
                                padding: "22px",
                                borderRadius: "15px",
                                background: "var(--bg)",
                                boxShadow: "var(--raised)",
                                border: "1px solid #ffffff99",
                            }}
                        >
                            <span className="eyebrow">
                                Imagery direction
                            </span>

                            <div
                                style={{
                                    display: "grid",
                                    gap: "12px",
                                    marginTop: "14px",
                                }}
                            >
                                {visibleImagery.map(
                                    (item) => (
                                        <article
                                            key={item}
                                            style={{
                                                display: "flex",
                                                alignItems:
                                                    "flex-start",
                                                gap: "12px",
                                                padding:
                                                    "14px 16px",
                                                borderRadius:
                                                    "12px",
                                                background:
                                                    "var(--bg)",
                                                boxShadow:
                                                    "var(--inset-shadow)",
                                            }}
                                        >
                                            <span
                                                aria-hidden="true"
                                                style={{
                                                    display:
                                                        "grid",
                                                    width: "28px",
                                                    height: "28px",
                                                    flexShrink: 0,
                                                    placeItems:
                                                        "center",
                                                    borderRadius:
                                                        "9px",
                                                    background:
                                                        "var(--accent-soft)",
                                                    color:
                                                        "var(--accent-dark)",
                                                    fontWeight: 750,
                                                    boxShadow:
                                                        "var(--small-shadow)",
                                                }}
                                            >
                                                →
                                            </span>

                                            <p
                                                style={{
                                                    paddingTop:
                                                        "3px",
                                                    fontSize:
                                                        "0.82rem",
                                                    lineHeight:
                                                        1.6,
                                                }}
                                            >
                                                {item}
                                            </p>
                                        </article>
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
                                background: "var(--bg)",
                                boxShadow: "var(--raised)",
                                border: "1px solid #ffffff99",
                            }}
                        >
                            <span className="eyebrow">
                                Design principles
                            </span>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(230px, 1fr))",
                                    gap: "14px",
                                    marginTop: "14px",
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
                                                gap: "13px",
                                                padding:
                                                    "16px",
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
                                                    width: "32px",
                                                    height: "32px",
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
                                                        "0.81rem",
                                                    lineHeight:
                                                        1.6,
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
                </div>
            )}
        </section>
    );
}