"use client";

export interface TypographyChoice {
    name: string;
    role: string;
    rationale?: string;
    style?: string;
}

interface TypographyCardProps {
    choices: TypographyChoice[];
}

export function TypographyCard({
    choices,
}: TypographyCardProps) {
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
                        Typography
                    </span>

                    <h2>
                        Give the identity a consistent voice.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        Typography should reinforce the personality
                        and hierarchy established by the brand strategy.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${choices.length} typography choices`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow: "var(--small-shadow)",
                    }}
                >
                    {choices.length}
                </span>
            </div>

            {choices.length === 0 ? (
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
                        No typography direction has been generated yet.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "20px",
                        marginTop: "28px",
                    }}
                >
                    {choices.map((choice, index) => (
                        <article
                            key={`${choice.name}-${choice.role}-${index}`}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "18px",
                                minHeight: "100%",
                                padding: "24px",
                                borderRadius: "16px",
                                background: "var(--bg)",
                                border: "1px solid #ffffff99",
                                boxShadow: "var(--raised)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                }}
                            >
                                <div>
                                    <span className="eyebrow">
                                        {choice.role}
                                    </span>

                                    <h3
                                        style={{
                                            marginTop: "5px",
                                            fontSize: "1.2rem",
                                            lineHeight: 1.3,
                                        }}
                                    >
                                        {choice.name}
                                    </h3>
                                </div>

                                <span
                                    style={{
                                        display: "grid",
                                        width: "36px",
                                        height: "36px",
                                        flexShrink: 0,
                                        placeItems: "center",
                                        borderRadius: "10px",
                                        background:
                                            "var(--accent-soft)",
                                        color:
                                            "var(--accent-dark)",
                                        boxShadow:
                                            "var(--small-shadow)",
                                        fontSize: "0.68rem",
                                        fontWeight: 750,
                                    }}
                                >
                                    {String(
                                        index + 1,
                                    ).padStart(2, "0")}
                                </span>
                            </div>

                            {choice.style ? (
                                <span
                                    style={{
                                        display:
                                            "inline-flex",
                                        alignSelf:
                                            "flex-start",
                                        padding:
                                            "7px 10px",
                                        borderRadius:
                                            "999px",
                                        background:
                                            "var(--accent-soft)",
                                        color:
                                            "var(--accent-dark)",
                                        fontSize:
                                            "0.68rem",
                                        fontWeight: 750,
                                    }}
                                >
                                    {choice.style}
                                </span>
                            ) : null}

                            <div
                                aria-label={`Typography preview for ${choice.name}`}
                                style={{
                                    display: "grid",
                                    minHeight: "150px",
                                    placeItems: "center",
                                    borderRadius: "14px",
                                    background: "var(--bg)",
                                    boxShadow:
                                        "var(--inset-shadow)",
                                }}
                            >
                                <span
                                    style={{
                                        color:
                                            "var(--text)",
                                        fontSize: "5rem",
                                        lineHeight: 1,
                                        letterSpacing:
                                            "-0.06em",
                                        fontWeight: 600,
                                    }}
                                >
                                    Aa
                                </span>
                            </div>

                            {choice.rationale ? (
                                <p
                                    className="muted"
                                    style={{
                                        fontSize:
                                            "0.81rem",
                                        lineHeight:
                                            1.65,
                                    }}
                                >
                                    {choice.rationale}
                                </p>
                            ) : null}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}