"use client";

interface PersonalityCardProps {
    traits: string[];
    avoidTraits?: string[];
    rationale?: Record<string, string>;
}

export function PersonalityCard({
    traits,
    avoidTraits = [],
    rationale = {},
}: PersonalityCardProps) {
    const visibleTraits = traits.filter(
        (trait) => trait.trim().length > 0,
    );

    const visibleAvoidTraits = avoidTraits.filter(
        (trait) => trait.trim().length > 0,
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
                        Brand personality
                    </span>

                    <h2>
                        How should the brand behave?
                    </h2>

                    <p
                        className="muted"
                        style={{
                            marginTop: "9px",
                            maxWidth: "700px",
                            lineHeight: 1.7,
                        }}
                    >
                        The personality translates the chosen
                        strategy into recognizable human
                        characteristics.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${visibleTraits.length} personality traits`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow:
                            "var(--small-shadow)",
                    }}
                >
                    {visibleTraits.length}
                </span>
            </div>

            {visibleTraits.length > 0 ? (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(210px, 1fr))",
                        gap: "18px",
                        marginTop: "28px",
                    }}
                >
                    {visibleTraits.map((trait) => (
                        <article
                            key={trait}
                            style={{
                                minHeight: "150px",
                                padding: "20px",
                                borderRadius: "15px",
                                background: "var(--bg)",
                                boxShadow:
                                    "var(--raised)",
                                border:
                                    "1px solid #ffffff99",
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
                                    aria-hidden="true"
                                    style={{
                                        width: "9px",
                                        height: "9px",
                                        flexShrink: 0,
                                        borderRadius: "50%",
                                        background:
                                            "var(--accent)",
                                        boxShadow:
                                            "0 0 0 4px var(--accent-soft)",
                                    }}
                                />

                                <h3
                                    style={{
                                        fontSize: "1rem",
                                        lineHeight: 1.35,
                                    }}
                                >
                                    {trait}
                                </h3>
                            </div>

                            {rationale[trait] ? (
                                <p
                                    className="muted"
                                    style={{
                                        marginTop: "14px",
                                        fontSize: "0.8rem",
                                        lineHeight: 1.65,
                                    }}
                                >
                                    {rationale[trait]}
                                </p>
                            ) : (
                                <p
                                    className="muted small"
                                    style={{
                                        marginTop: "14px",
                                    }}
                                >
                                    A defining characteristic
                                    of the brand.
                                </p>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
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
                        No personality traits have been
                        generated yet.
                    </p>
                </div>
            )}

            {visibleAvoidTraits.length > 0 ? (
                <div
                    style={{
                        marginTop: "28px",
                        paddingTop: "24px",
                        borderTop:
                            "1px solid var(--line)",
                    }}
                >
                    <span className="eyebrow">
                        Traits to avoid
                    </span>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px",
                            marginTop: "12px",
                        }}
                    >
                        {visibleAvoidTraits.map(
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
        </section>
    );
}