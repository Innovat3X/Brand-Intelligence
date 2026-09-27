"use client";

export interface NamingOption {
    name: string;
    rationale?: string;
    territory?: string;
    strengths?: string[];
    concerns?: string[];
}

interface NamingCardProps {
    options: NamingOption[];
    selectedName?: string | null;
    disabled?: boolean;
    onSelect?: (option: NamingOption) => void;
}

export function NamingCard({
    options,
    selectedName = null,
    disabled = false,
    onSelect,
}: NamingCardProps) {
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
                        Naming direction
                    </span>

                    <h2>
                        Which name has the strongest logic?
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        Names are presented with reasoning so the
                        choice is based on the brand direction rather
                        than novelty alone.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${options.length} naming options`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow: "var(--small-shadow)",
                    }}
                >
                    {options.length}
                </span>
            </div>

            {options.length === 0 ? (
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
                        No naming options have been generated yet.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(270px, 1fr))",
                        gap: "20px",
                        marginTop: "28px",
                    }}
                >
                    {options.map((option) => {
                        const selected =
                            selectedName === option.name;

                        return (
                            <article
                                key={option.name}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "18px",
                                    minHeight: "100%",
                                    padding: "24px",
                                    borderRadius: "16px",
                                    background: "var(--bg)",
                                    border: selected
                                        ? "1px solid var(--accent)"
                                        : "1px solid #ffffff99",
                                    boxShadow: selected
                                        ? "var(--inset-shadow)"
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
                                        gap: "14px",
                                    }}
                                >
                                    <div>
                                        <span className="eyebrow">
                                            Naming option
                                        </span>

                                        <h3
                                            style={{
                                                marginTop: "5px",
                                                fontSize: "1.35rem",
                                                lineHeight: 1.25,
                                            }}
                                        >
                                            {option.name}
                                        </h3>
                                    </div>

                                    {selected ? (
                                        <span
                                            style={{
                                                flexShrink: 0,
                                                padding:
                                                    "7px 10px",
                                                borderRadius:
                                                    "999px",
                                                background:
                                                    "var(--accent-soft)",
                                                color:
                                                    "var(--accent-dark)",
                                                fontSize:
                                                    "0.65rem",
                                                fontWeight: 750,
                                                letterSpacing:
                                                    "0.06em",
                                                textTransform:
                                                    "uppercase",
                                                boxShadow:
                                                    "var(--small-shadow)",
                                            }}
                                        >
                                            Selected
                                        </span>
                                    ) : null}
                                </div>

                                {option.territory ? (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignSelf: "flex-start",
                                            padding: "7px 11px",
                                            borderRadius: "999px",
                                            background:
                                                "var(--accent-soft)",
                                            color:
                                                "var(--accent-dark)",
                                            fontSize:
                                                "0.7rem",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {option.territory}
                                    </span>
                                ) : null}

                                {option.rationale ? (
                                    <p
                                        className="muted"
                                        style={{
                                            lineHeight: 1.65,
                                            fontSize: "0.83rem",
                                        }}
                                    >
                                        {option.rationale}
                                    </p>
                                ) : null}

                                {option.strengths &&
                                    option.strengths.length > 0 ? (
                                    <div
                                        style={{
                                            padding: "16px",
                                            borderRadius: "12px",
                                            background:
                                                "var(--bg)",
                                            boxShadow:
                                                "var(--inset-shadow)",
                                        }}
                                    >
                                        <span className="eyebrow">
                                            Strengths
                                        </span>

                                        <ul
                                            style={{
                                                display: "grid",
                                                gap: "8px",
                                                margin:
                                                    "10px 0 0",
                                                paddingLeft:
                                                    "18px",
                                            }}
                                        >
                                            {option.strengths.map(
                                                (strength) => (
                                                    <li
                                                        key={
                                                            strength
                                                        }
                                                        className="muted"
                                                        style={{
                                                            fontSize:
                                                                "0.8rem",
                                                            lineHeight:
                                                                1.55,
                                                        }}
                                                    >
                                                        {
                                                            strength
                                                        }
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                ) : null}

                                {option.concerns &&
                                    option.concerns.length > 0 ? (
                                    <div
                                        style={{
                                            padding: "16px",
                                            borderRadius: "12px",
                                            background:
                                                "var(--bg)",
                                            boxShadow:
                                                "var(--inset-shadow)",
                                        }}
                                    >
                                        <span className="eyebrow">
                                            Consider
                                        </span>

                                        <ul
                                            style={{
                                                display: "grid",
                                                gap: "8px",
                                                margin:
                                                    "10px 0 0",
                                                paddingLeft:
                                                    "18px",
                                            }}
                                        >
                                            {option.concerns.map(
                                                (concern) => (
                                                    <li
                                                        key={
                                                            concern
                                                        }
                                                        className="muted"
                                                        style={{
                                                            fontSize:
                                                                "0.8rem",
                                                            lineHeight:
                                                                1.55,
                                                        }}
                                                    >
                                                        {
                                                            concern
                                                        }
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                ) : null}

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
                                            disabled={disabled}
                                            onClick={() =>
                                                onSelect(
                                                    option,
                                                )
                                            }
                                            aria-pressed={
                                                selected
                                            }
                                            style={{
                                                width: "100%",
                                            }}
                                        >
                                            {selected
                                                ? "Name selected"
                                                : "Choose this name"}
                                        </button>
                                    </div>
                                ) : null}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}