"use client";

export interface ColorSwatch {
    name: string;
    hex: string;
    role?: string;
    rationale?: string;
}

interface ColorPaletteProps {
    colors: ColorSwatch[];
}

export function ColorPalette({
    colors,
}: ColorPaletteProps) {
    const validColors = colors.filter(
        (color) =>
            color.name.trim().length > 0 &&
            color.hex.trim().length > 0,
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
                        Color system
                    </span>

                    <h2>
                        Build a coherent palette.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        Each color has a role in the identity rather
                        than being selected as an isolated decoration.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${validColors.length} colors`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow: "var(--small-shadow)",
                    }}
                >
                    {validColors.length}
                </span>
            </div>

            {validColors.length === 0 ? (
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
                        No colors have been generated yet.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(250px, 1fr))",
                        gap: "20px",
                        marginTop: "28px",
                    }}
                >
                    {validColors.map((color) => (
                        <article
                            key={`${color.name}-${color.hex}`}
                            style={{
                                overflow: "hidden",
                                borderRadius: "16px",
                                background: "var(--bg)",
                                border: "1px solid #ffffff99",
                                boxShadow: "var(--raised)",
                            }}
                        >
                            <div
                                style={{
                                    height: "150px",
                                    position: "relative",
                                    backgroundColor:
                                        color.hex,
                                }}
                                aria-label={`${color.name}, ${color.hex}`}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "14px",
                                        bottom: "14px",
                                        padding:
                                            "8px 10px",
                                        borderRadius:
                                            "10px",
                                        background:
                                            "rgba(255, 255, 255, 0.82)",
                                        backdropFilter:
                                            "blur(8px)",
                                        WebkitBackdropFilter:
                                            "blur(8px)",
                                        fontSize:
                                            "0.68rem",
                                        fontWeight: 750,
                                    }}
                                >
                                    {color.hex}
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "20px",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems:
                                            "flex-start",
                                        justifyContent:
                                            "space-between",
                                        gap: "12px",
                                    }}
                                >
                                    <div>
                                        <span className="eyebrow">
                                            Color
                                        </span>

                                        <h3
                                            style={{
                                                marginTop:
                                                    "5px",
                                                fontSize:
                                                    "1rem",
                                                lineHeight:
                                                    1.35,
                                            }}
                                        >
                                            {color.name}
                                        </h3>
                                    </div>

                                    <code
                                        style={{
                                            padding:
                                                "6px 8px",
                                            borderRadius:
                                                "8px",
                                            background:
                                                "var(--bg)",
                                            boxShadow:
                                                "var(--inset-shadow)",
                                            color:
                                                "var(--accent-dark)",
                                            fontSize:
                                                "0.7rem",
                                        }}
                                    >
                                        {color.hex}
                                    </code>
                                </div>

                                {color.role ? (
                                    <span
                                        style={{
                                            display:
                                                "inline-flex",
                                            marginTop:
                                                "14px",
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
                                            fontWeight:
                                                750,
                                        }}
                                    >
                                        {color.role}
                                    </span>
                                ) : null}

                                {color.rationale ? (
                                    <p
                                        className="muted"
                                        style={{
                                            marginTop:
                                                "14px",
                                            fontSize:
                                                "0.8rem",
                                            lineHeight:
                                                1.65,
                                        }}
                                    >
                                        {color.rationale}
                                    </p>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}