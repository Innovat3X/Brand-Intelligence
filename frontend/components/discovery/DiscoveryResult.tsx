"use client";

import {
    hasContent,
    isRecord,
    readableLabel,
} from "../../lib/brand";

interface DiscoveryResultProps {
    data: unknown;
}

function ValueView({
    value,
}: {
    value: unknown;
}) {
    if (
        value === null ||
        value === undefined
    ) {
        return (
            <span className="muted small">
                Not provided
            </span>
        );
    }

    if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return (
            <p
                style={{
                    fontSize: "0.84rem",
                    lineHeight: 1.7,
                }}
            >
                {String(value)}
            </p>
        );
    }

    if (Array.isArray(value)) {
        const items = value.filter(
            hasContent,
        );

        if (items.length === 0) {
            return (
                <span className="muted small">
                    No information returned
                </span>
            );
        }

        return (
            <div
                style={{
                    display: "grid",
                    gap: "10px",
                }}
            >
                {items.map(
                    (item, index) => (
                        <div
                            key={index}
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "flex-start",
                                gap: "10px",
                                padding:
                                    "12px 14px",
                                borderRadius:
                                    "11px",
                                background:
                                    "var(--bg)",
                                boxShadow:
                                    "var(--inset-shadow)",
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    width:
                                        "7px",
                                    height:
                                        "7px",
                                    flexShrink:
                                        0,
                                    marginTop:
                                        "7px",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "var(--accent)",
                                    boxShadow:
                                        "0 0 0 4px var(--accent-soft)",
                                }}
                            />

                            <div
                                style={{
                                    minWidth:
                                        0,
                                    flex: 1,
                                }}
                            >
                                <ValueView
                                    value={
                                        item
                                    }
                                />
                            </div>
                        </div>
                    ),
                )}
            </div>
        );
    }

    if (isRecord(value)) {
        const entries =
            Object.entries(
                value,
            ).filter(
                ([, entry]) =>
                    hasContent(
                        entry,
                    ),
            );

        if (
            entries.length === 0
        ) {
            return (
                <span className="muted small">
                    No information returned
                </span>
            );
        }

        return (
            <div
                style={{
                    display: "grid",
                    gap: "14px",
                }}
            >
                {entries.map(
                    ([
                        key,
                        entry,
                    ]) => (
                        <div
                            key={key}
                            style={{
                                padding:
                                    "16px",
                                borderRadius:
                                    "12px",
                                background:
                                    "var(--bg)",
                                boxShadow:
                                    "var(--raised)",
                                border:
                                    "1px solid #ffffff99",
                            }}
                        >
                            <span
                                className="eyebrow"
                                style={{
                                    marginBottom:
                                        "7px",
                                }}
                            >
                                {readableLabel(
                                    key,
                                )}
                            </span>

                            <ValueView
                                value={
                                    entry
                                }
                            />
                        </div>
                    ),
                )}
            </div>
        );
    }

    return (
        <p
            style={{
                fontSize: "0.84rem",
                lineHeight: 1.7,
            }}
        >
            {String(value)}
        </p>
    );
}

export function DiscoveryResult({
    data,
}: DiscoveryResultProps) {
    if (!hasContent(data)) {
        return (
            <section
                className="surface"
                style={{
                    marginTop: "30px",
                    padding: "32px",
                }}
            >
                <span className="eyebrow">
                    Discovery result
                </span>

                <h2>
                    No result yet.
                </h2>

                <p
                    className="muted"
                    style={{
                        maxWidth:
                            "700px",
                        marginTop:
                            "9px",
                        lineHeight:
                            1.7,
                    }}
                >
                    Run discovery to turn
                    the rough idea into
                    structured brand
                    context.
                </p>
            </section>
        );
    }

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
                    display:
                        "flex",
                    alignItems:
                        "flex-start",
                    justifyContent:
                        "space-between",
                    gap: "20px",
                }}
            >
                <div>
                    <span className="eyebrow">
                        Discovery result
                    </span>

                    <h2>
                        What we understand
                        so far.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth:
                                "720px",
                            marginTop:
                                "9px",
                            lineHeight:
                                1.7,
                        }}
                    >
                        This context becomes
                        the foundation for the
                        next stages. Later
                        decisions should build
                        on it rather than
                        restart from the
                        original idea.
                    </p>
                </div>

                <span
                    style={{
                        display:
                            "inline-flex",
                        alignItems:
                            "center",
                        gap: "7px",
                        flexShrink: 0,
                        padding:
                            "8px 11px",
                        borderRadius:
                            "999px",
                        background:
                            "var(--accent-soft)",
                        color:
                            "var(--accent-dark)",
                        boxShadow:
                            "var(--small-shadow)",
                        fontSize:
                            "0.65rem",
                        fontWeight:
                            750,
                        letterSpacing:
                            "0.05em",
                        textTransform:
                            "uppercase",
                    }}
                >
                    <span
                        aria-hidden="true"
                        style={{
                            width:
                                "7px",
                            height:
                                "7px",
                            borderRadius:
                                "50%",
                            background:
                                "var(--success)",
                        }}
                    />

                    Structured
                </span>
            </div>

            <div
                style={{
                    marginTop:
                        "28px",
                    padding:
                        "22px",
                    borderRadius:
                        "15px",
                    background:
                        "var(--bg)",
                    boxShadow:
                        "var(--inset-shadow)",
                }}
            >
                <ValueView
                    value={data}
                />
            </div>
        </section>
    );
}