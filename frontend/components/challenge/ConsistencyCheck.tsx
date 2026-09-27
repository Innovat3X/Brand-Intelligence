"use client";

export interface ConsistencyItem {
    area: string;
    status: "pass" | "warning" | "fail";
    explanation: string;
}

interface ConsistencyCheckProps {
    items: ConsistencyItem[];
}

export function ConsistencyCheck({
    items,
}: ConsistencyCheckProps) {
    const passed = items.filter(
        (item) => item.status === "pass",
    ).length;

    const statusLabel = {
        pass: "Aligned",
        warning: "Review",
        fail: "Conflict",
    } as const;

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
                        Consistency check
                    </span>

                    <h2>
                        Do the decisions reinforce each other?
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        Check whether the strategic, verbal, and
                        visual decisions form one coherent system.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${passed} of ${items.length} checks passed`}
                    style={{
                        width: "58px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow: "var(--small-shadow)",
                        fontSize: "0.72rem",
                    }}
                >
                    {passed}/{items.length}
                </span>
            </div>

            {items.length === 0 ? (
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
                        No consistency checks have been generated yet.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "18px",
                        marginTop: "28px",
                    }}
                >
                    {items.map((item, index) => {
                        const status = item.status;

                        const icon =
                            status === "pass"
                                ? "✓"
                                : status === "warning"
                                    ? "!"
                                    : "×";

                        return (
                            <article
                                key={`${item.area}-${index}`}
                                style={{
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
                                        alignItems:
                                            "flex-start",
                                        justifyContent:
                                            "space-between",
                                        gap: "14px",
                                    }}
                                >
                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: "11px",
                                            minWidth:
                                                0,
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                display:
                                                    "grid",
                                                width:
                                                    "34px",
                                                height:
                                                    "34px",
                                                flexShrink:
                                                    0,
                                                placeItems:
                                                    "center",
                                                borderRadius:
                                                    "10px",
                                                background:
                                                    "var(--bg)",
                                                boxShadow:
                                                    "var(--small-shadow)",
                                                color:
                                                    status ===
                                                        "pass"
                                                        ? "var(--success)"
                                                        : status ===
                                                            "warning"
                                                            ? "var(--warning)"
                                                            : "var(--danger)",
                                                fontSize:
                                                    "0.9rem",
                                                fontWeight:
                                                    800,
                                            }}
                                        >
                                            {icon}
                                        </span>

                                        <h3
                                            style={{
                                                fontSize:
                                                    "0.95rem",
                                                lineHeight:
                                                    1.4,
                                            }}
                                        >
                                            {item.area}
                                        </h3>
                                    </div>

                                    <span
                                        style={{
                                            flexShrink:
                                                0,
                                            padding:
                                                "6px 9px",
                                            borderRadius:
                                                "999px",
                                            background:
                                                "var(--bg)",
                                            boxShadow:
                                                "var(--small-shadow)",
                                            color:
                                                status ===
                                                    "pass"
                                                    ? "var(--success)"
                                                    : status ===
                                                        "warning"
                                                        ? "var(--warning)"
                                                        : "var(--danger)",
                                            fontSize:
                                                "0.63rem",
                                            fontWeight:
                                                750,
                                            letterSpacing:
                                                "0.05em",
                                            textTransform:
                                                "uppercase",
                                        }}
                                    >
                                        {
                                            statusLabel[
                                            status
                                            ]
                                        }
                                    </span>
                                </div>

                                <div
                                    style={{
                                        marginTop: "16px",
                                        padding: "15px 16px",
                                        borderRadius: "12px",
                                        background:
                                            "var(--bg)",
                                        boxShadow:
                                            "var(--inset-shadow)",
                                    }}
                                >
                                    <p
                                        className="muted"
                                        style={{
                                            fontSize:
                                                "0.8rem",
                                            lineHeight:
                                                1.65,
                                        }}
                                    >
                                        {
                                            item.explanation
                                        }
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}