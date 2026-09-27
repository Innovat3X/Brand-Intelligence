"use client";

interface PositioningCardProps {
    title: string;
    description: string;
    rationale?: string;
    differentiator?: string;
    valueProposition?: string;
    selected?: boolean;
    disabled?: boolean;
    onSelect?: () => void;
}

export function PositioningCard({
    title,
    description,
    rationale,
    differentiator,
    valueProposition,
    selected = false,
    disabled = false,
    onSelect,
}: PositioningCardProps) {
    return (
        <article
            className="surface"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "26px",
                minHeight: "100%",
                border: selected
                    ? "1px solid var(--accent)"
                    : undefined,
                boxShadow: selected
                    ? "inset 3px 3px 8px #d1d8e2, inset -3px -3px 8px #ffffff, 0 0 0 1px #4656b822"
                    : "var(--raised)",
                transition:
                    "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
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
                <div style={{ minWidth: 0 }}>
                    <span className="eyebrow">
                        Strategic direction
                    </span>

                    <h3
                        style={{
                            marginTop: "6px",
                            fontSize: "1.25rem",
                            lineHeight: 1.3,
                        }}
                    >
                        {title}
                    </h3>
                </div>

                {selected ? (
                    <span
                        style={{
                            flexShrink: 0,
                            padding: "7px 10px",
                            borderRadius: "999px",
                            background: "var(--accent-soft)",
                            color: "var(--accent-dark)",
                            fontSize: "0.68rem",
                            fontWeight: 750,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            boxShadow:
                                "var(--small-shadow)",
                        }}
                    >
                        Selected
                    </span>
                ) : null}
            </div>

            <p
                className="muted"
                style={{
                    lineHeight: 1.7,
                }}
            >
                {description}
            </p>

            <div
                style={{
                    display: "grid",
                    gap: "12px",
                }}
            >
                {valueProposition ? (
                    <div
                        style={{
                            padding: "15px 16px",
                            borderRadius: "12px",
                            background: "var(--bg)",
                            boxShadow:
                                "var(--inset-shadow)",
                        }}
                    >
                        <span
                            style={{
                                display: "block",
                                marginBottom: "6px",
                                color: "var(--accent-dark)",
                                fontSize: "0.67rem",
                                fontWeight: 750,
                                letterSpacing: "0.1em",
                                textTransform:
                                    "uppercase",
                            }}
                        >
                            Value proposition
                        </span>

                        <p
                            style={{
                                fontSize: "0.82rem",
                                lineHeight: 1.6,
                            }}
                        >
                            {valueProposition}
                        </p>
                    </div>
                ) : null}

                {differentiator ? (
                    <div
                        style={{
                            padding: "15px 16px",
                            borderRadius: "12px",
                            background: "var(--bg)",
                            boxShadow:
                                "var(--inset-shadow)",
                        }}
                    >
                        <span
                            style={{
                                display: "block",
                                marginBottom: "6px",
                                color: "var(--accent-dark)",
                                fontSize: "0.67rem",
                                fontWeight: 750,
                                letterSpacing: "0.1em",
                                textTransform:
                                    "uppercase",
                            }}
                        >
                            Differentiator
                        </span>

                        <p
                            style={{
                                fontSize: "0.82rem",
                                lineHeight: 1.6,
                            }}
                        >
                            {differentiator}
                        </p>
                    </div>
                ) : null}

                {rationale ? (
                    <div
                        style={{
                            padding: "15px 16px",
                            borderRadius: "12px",
                            background: "var(--bg)",
                            boxShadow:
                                "var(--inset-shadow)",
                        }}
                    >
                        <span
                            style={{
                                display: "block",
                                marginBottom: "6px",
                                color: "var(--accent-dark)",
                                fontSize: "0.67rem",
                                fontWeight: 750,
                                letterSpacing: "0.1em",
                                textTransform:
                                    "uppercase",
                            }}
                        >
                            Why this direction
                        </span>

                        <p
                            style={{
                                fontSize: "0.82rem",
                                lineHeight: 1.6,
                            }}
                        >
                            {rationale}
                        </p>
                    </div>
                ) : null}
            </div>

            {onSelect ? (
                <div
                    style={{
                        marginTop: "auto",
                        paddingTop: "4px",
                    }}
                >
                    <button
                        type="button"
                        className={
                            selected
                                ? "button"
                                : "button primary"
                        }
                        onClick={onSelect}
                        disabled={disabled}
                        aria-pressed={selected}
                        style={{
                            width: "100%",
                        }}
                    >
                        {selected
                            ? "Direction selected"
                            : "Choose this direction"}
                    </button>
                </div>
            ) : null}
        </article>
    );
}