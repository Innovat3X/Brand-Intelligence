"use client";

interface VoiceCardProps {
    principles: string[];
    doExamples?: string[];
    dontExamples?: string[];
    sampleMessages?: string[];
}

export function VoiceCard({
    principles,
    doExamples = [],
    dontExamples = [],
    sampleMessages = [],
}: VoiceCardProps) {
    const visiblePrinciples = principles.filter(
        (principle) => principle.trim().length > 0,
    );

    const visibleDoExamples = doExamples.filter(
        (example) => example.trim().length > 0,
    );

    const visibleDontExamples = dontExamples.filter(
        (example) => example.trim().length > 0,
    );

    const visibleMessages = sampleMessages.filter(
        (message) => message.trim().length > 0,
    );

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
                        How should the brand sound?
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        The voice translates personality into
                        repeatable language principles and
                        practical examples.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${visiblePrinciples.length} voice principles`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow: "var(--small-shadow)",
                    }}
                >
                    {visiblePrinciples.length}
                </span>
            </div>

            {visiblePrinciples.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: "16px",
                        marginTop: "28px",
                    }}
                >
                    {visiblePrinciples.map(
                        (principle, index) => (
                            <article
                                key={`${principle}-${index}`}
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "flex-start",
                                    gap: "14px",
                                    padding: "18px",
                                    borderRadius: "14px",
                                    background:
                                        "var(--bg)",
                                    boxShadow:
                                        "var(--raised)",
                                    border:
                                        "1px solid #ffffff99",
                                }}
                            >
                                <span
                                    style={{
                                        display: "grid",
                                        width: "34px",
                                        height: "34px",
                                        flexShrink: 0,
                                        placeItems:
                                            "center",
                                        borderRadius:
                                            "10px",
                                        background:
                                            "var(--accent-soft)",
                                        color:
                                            "var(--accent-dark)",
                                        boxShadow:
                                            "var(--small-shadow)",
                                        fontSize:
                                            "0.68rem",
                                        fontWeight: 750,
                                    }}
                                >
                                    {String(
                                        index + 1,
                                    ).padStart(2, "0")}
                                </span>

                                <p
                                    style={{
                                        paddingTop:
                                            "4px",
                                        fontSize:
                                            "0.84rem",
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
            ) : (
                <div
                    style={{
                        marginTop: "26px",
                        padding: "24px",
                        borderRadius: "14px",
                        background:
                            "var(--bg)",
                        boxShadow:
                            "var(--inset-shadow)",
                        textAlign: "center",
                    }}
                >
                    <p className="muted">
                        No voice principles have been
                        generated yet.
                    </p>
                </div>
            )}

            {visibleDoExamples.length > 0 ||
                visibleDontExamples.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                        marginTop: "28px",
                    }}
                >
                    {visibleDoExamples.length > 0 ? (
                        <div
                            style={{
                                padding: "20px",
                                borderRadius: "14px",
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
                                    gap: "10px",
                                    margin:
                                        "12px 0 0",
                                    paddingLeft:
                                        "18px",
                                }}
                            >
                                {visibleDoExamples.map(
                                    (example) => (
                                        <li
                                            key={example}
                                            style={{
                                                fontSize:
                                                    "0.8rem",
                                                lineHeight:
                                                    1.6,
                                            }}
                                        >
                                            {example}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    ) : null}

                    {visibleDontExamples.length > 0 ? (
                        <div
                            style={{
                                padding: "20px",
                                borderRadius: "14px",
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
                                    gap: "10px",
                                    margin:
                                        "12px 0 0",
                                    paddingLeft:
                                        "18px",
                                }}
                            >
                                {visibleDontExamples.map(
                                    (example) => (
                                        <li
                                            key={example}
                                            className="muted"
                                            style={{
                                                fontSize:
                                                    "0.8rem",
                                                lineHeight:
                                                    1.6,
                                            }}
                                        >
                                            {example}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    ) : null}
                </div>
            ) : null}

            {visibleMessages.length > 0 ? (
                <div
                    style={{
                        marginTop: "28px",
                        paddingTop: "26px",
                        borderTop:
                            "1px solid var(--line)",
                    }}
                >
                    <span className="eyebrow">
                        Sample messages
                    </span>

                    <div
                        style={{
                            display: "grid",
                            gap: "14px",
                            marginTop: "14px",
                        }}
                    >
                        {visibleMessages.map(
                            (message) => (
                                <blockquote
                                    key={message}
                                    style={{
                                        margin: 0,
                                        padding:
                                            "18px 20px",
                                        borderRadius:
                                            "14px",
                                        background:
                                            "var(--bg)",
                                        boxShadow:
                                            "var(--inset-shadow)",
                                        color:
                                            "var(--text)",
                                        fontSize:
                                            "0.86rem",
                                        lineHeight:
                                            1.7,
                                    }}
                                >
                                    “{message}”
                                </blockquote>
                            ),
                        )}
                    </div>
                </div>
            ) : null}
        </section>
    );
}