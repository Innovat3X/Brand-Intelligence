"use client";

interface VisualColor {
    name: string;
    hex: string;
    role?: string;
}

interface VisualIdentityProps {
    direction?: string;
    colors?: VisualColor[];
    typography?: string[];
    imagery?: string[];
}

export function VisualIdentity({
    direction,
    colors = [],
    typography = [],
    imagery = [],
}: VisualIdentityProps) {
    const visibleColors = colors.filter(
        (color) =>
            color.name.trim().length > 0 &&
            color.hex.trim().length > 0,
    );

    const visibleTypography = typography.filter(
        (font) => font.trim().length > 0,
    );

    const visibleImagery = imagery.filter(
        (item) => item.trim().length > 0,
    );

    const hasContent =
        Boolean(direction?.trim()) ||
        visibleColors.length > 0 ||
        visibleTypography.length > 0 ||
        visibleImagery.length > 0;

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
                        Visual identity
                    </span>

                    <h2>
                        The visual system.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        The visual decisions that translate the
                        brand strategy into a recognizable identity.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${visibleColors.length} colors`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow:
                            "var(--small-shadow)",
                    }}
                >
                    {visibleColors.length}
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
                        No visual identity decisions have been
                        assembled yet.
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
                                background:
                                    "var(--bg)",
                                boxShadow:
                                    "var(--inset-shadow)",
                            }}
                        >
                            <span className="eyebrow">
                                Visual direction
                            </span>

                            <p
                                style={{
                                    marginTop: "8px",
                                    lineHeight: 1.75,
                                }}
                            >
                                {direction}
                            </p>
                        </div>
                    ) : null}

                    {visibleColors.length > 0 ? (
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
                                Color palette
                            </span>

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                    gap: "16px",
                                    marginTop:
                                        "14px",
                                }}
                            >
                                {visibleColors.map(
                                    (color) => (
                                        <article
                                            key={`${color.name}-${color.hex}`}
                                            style={{
                                                overflow:
                                                    "hidden",
                                                borderRadius:
                                                    "14px",
                                                background:
                                                    "var(--bg)",
                                                boxShadow:
                                                    "var(--raised)",
                                                border:
                                                    "1px solid #ffffff99",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    height:
                                                        "90px",
                                                    backgroundColor:
                                                        color.hex,
                                                }}
                                                aria-label={`${color.name}, ${color.hex}`}
                                            />

                                            <div
                                                style={{
                                                    padding:
                                                        "16px",
                                                }}
                                            >
                                                <strong
                                                    style={{
                                                        display:
                                                            "block",
                                                        fontSize:
                                                            "0.85rem",
                                                    }}
                                                >
                                                    {
                                                        color.name
                                                    }
                                                </strong>

                                                <code
                                                    style={{
                                                        display:
                                                            "inline-block",
                                                        marginTop:
                                                            "7px",
                                                        padding:
                                                            "5px 7px",
                                                        borderRadius:
                                                            "7px",
                                                        background:
                                                            "var(--bg)",
                                                        boxShadow:
                                                            "var(--inset-shadow)",
                                                        color:
                                                            "var(--accent-dark)",
                                                        fontSize:
                                                            "0.68rem",
                                                    }}
                                                >
                                                    {
                                                        color.hex
                                                    }
                                                </code>

                                                {color.role ? (
                                                    <span
                                                        className="muted small"
                                                        style={{
                                                            display:
                                                                "block",
                                                            marginTop:
                                                                "9px",
                                                        }}
                                                    >
                                                        {
                                                            color.role
                                                        }
                                                    </span>
                                                ) : null}
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : null}

                    {visibleTypography.length > 0 ? (
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
                                Typography
                            </span>

                            <div
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(230px, 1fr))",
                                    gap: "14px",
                                    marginTop:
                                        "14px",
                                }}
                            >
                                {visibleTypography.map(
                                    (
                                        font,
                                        index,
                                    ) => (
                                        <div
                                            key={
                                                font
                                            }
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap:
                                                    "13px",
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
                                                    width:
                                                        "34px",
                                                    height:
                                                        "34px",
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

                                            <span
                                                style={{
                                                    fontSize:
                                                        "0.84rem",
                                                    lineHeight:
                                                        1.5,
                                                }}
                                            >
                                                {
                                                    font
                                                }
                                            </span>
                                        </div>
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
                                background:
                                    "var(--bg)",
                                boxShadow:
                                    "var(--raised)",
                                border:
                                    "1px solid #ffffff99",
                            }}
                        >
                            <span className="eyebrow">
                                Imagery
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
                                {visibleImagery.map(
                                    (item) => (
                                        <div
                                            key={
                                                item
                                            }
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "flex-start",
                                                gap:
                                                    "12px",
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
                                                aria-hidden="true"
                                                style={{
                                                    display:
                                                        "grid",
                                                    width:
                                                        "28px",
                                                    height:
                                                        "28px",
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
                                                    fontWeight:
                                                        800,
                                                }}
                                            >
                                                →
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
                                                {
                                                    item
                                                }
                                            </p>
                                        </div>
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