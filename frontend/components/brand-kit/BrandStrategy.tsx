"use client";

interface BrandStrategyProps {
    positioning?: string;
    audience?: string;
    valueProposition?: string;
    differentiation?: string;
    promise?: string;
}

export function BrandStrategy({
    positioning,
    audience,
    valueProposition,
    differentiation,
    promise,
}: BrandStrategyProps) {
    const items = [
        {
            label: "Positioning",
            value: positioning,
        },
        {
            label: "Audience",
            value: audience,
        },
        {
            label: "Value proposition",
            value: valueProposition,
        },
        {
            label: "Differentiation",
            value: differentiation,
        },
        {
            label: "Brand promise",
            value: promise,
        },
    ].filter(
        (
            item,
        ): item is {
            label: string;
            value: string;
        } => Boolean(item.value?.trim()),
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
                        Brand strategy
                    </span>

                    <h2>
                        The strategic foundation.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        The core decisions that define who the
                        brand serves, what it offers, and why it
                        should matter.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${items.length} strategic decisions`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow:
                            "var(--small-shadow)",
                    }}
                >
                    {items.length}
                </span>
            </div>

            {items.length === 0 ? (
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
                        No strategic decisions have been
                        assembled yet.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "18px",
                        marginTop: "28px",
                    }}
                >
                    {items.map(
                        (item, index) => (
                            <article
                                key={item.label}
                                style={{
                                    position:
                                        "relative",
                                    minHeight: "150px",
                                    padding: "22px",
                                    borderRadius:
                                        "15px",
                                    background:
                                        "var(--bg)",
                                    border:
                                        "1px solid #ffffff99",
                                    boxShadow:
                                        "var(--raised)",
                                }}
                            >
                                <span
                                    style={{
                                        display:
                                            "inline-grid",
                                        width: "32px",
                                        height: "32px",
                                        placeItems:
                                            "center",
                                        borderRadius:
                                            "9px",
                                        background:
                                            "var(--accent-soft)",
                                        color:
                                            "var(--accent-dark)",
                                        boxShadow:
                                            "var(--small-shadow)",
                                        fontSize:
                                            "0.67rem",
                                        fontWeight:
                                            750,
                                    }}
                                >
                                    {String(
                                        index + 1,
                                    ).padStart(2, "0")}
                                </span>

                                <span
                                    className="eyebrow"
                                    style={{
                                        marginTop:
                                            "16px",
                                    }}
                                >
                                    {item.label}
                                </span>

                                <p
                                    style={{
                                        marginTop:
                                            "8px",
                                        fontSize:
                                            "0.85rem",
                                        lineHeight:
                                            1.7,
                                    }}
                                >
                                    {item.value}
                                </p>
                            </article>
                        ),
                    )}
                </div>
            )}
        </section>
    );
}