"use client";

interface BrandHeaderProps {
    name: string;
    tagline?: string;
    summary?: string;
}

function BrandHeader({
    name,
    tagline,
    summary,
}: BrandHeaderProps) {
    return (
        <section
            className="surface"
            style={{
                marginTop: "30px",
                padding: "38px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: "-70px",
                    right: "-70px",
                    width: "210px",
                    height: "210px",
                    borderRadius: "50%",
                    background: "var(--bg)",
                    boxShadow:
                        "inset 18px 18px 32px #d1d8e2, inset -18px -18px 32px #ffffff",
                    opacity: 0.75,
                }}
            />

            <div
                style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns:
                        "auto minmax(0, 1fr)",
                    alignItems: "start",
                    gap: "24px",
                }}
            >
                <div
                    aria-hidden="true"
                    style={{
                        display: "grid",
                        width: "78px",
                        height: "78px",
                        placeItems: "center",
                        borderRadius: "22px",
                        background: "var(--bg)",
                        boxShadow:
                            "var(--raised)",
                    }}
                >
                    <span
                        style={{
                            position: "relative",
                            display: "block",
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            background:
                                "var(--accent)",
                            boxShadow:
                                "8px 8px 14px #d2d8e1, -5px -5px 12px #ffffff",
                            transform:
                                "rotate(45deg)",
                        }}
                    >
                        <span
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: "10px",
                                height: "10px",
                                borderRadius:
                                    "50%",
                                background:
                                    "var(--surface)",
                                transform:
                                    "translate(-50%, -50%) rotate(-45deg)",
                                boxShadow:
                                    "inset 2px 2px 5px #d1d8e2, inset -2px -2px 5px #ffffff",
                            }}
                        />
                    </span>
                </div>

                <div
                    style={{
                        minWidth: 0,
                    }}
                >
                    <span className="eyebrow">
                        Brand identity
                    </span>

                    <h1
                        style={{
                            marginTop: "8px",
                            fontSize:
                                "clamp(2.2rem, 5vw, 4.4rem)",
                            lineHeight: 1.04,
                            letterSpacing:
                                "-0.055em",
                        }}
                    >
                        {name}
                    </h1>

                    {tagline ? (
                        <p
                            style={{
                                marginTop: "14px",
                                color:
                                    "var(--accent-dark)",
                                fontSize: "1.05rem",
                                fontWeight: 650,
                                lineHeight: 1.5,
                            }}
                        >
                            {tagline}
                        </p>
                    ) : null}

                    {summary ? (
                        <p
                            className="muted"
                            style={{
                                maxWidth: "780px",
                                marginTop: "14px",
                                lineHeight: 1.75,
                            }}
                        >
                            {summary}
                        </p>
                    ) : null}
                </div>
            </div>

            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "30px",
                    paddingTop: "20px",
                    borderTop:
                        "1px solid var(--line)",
                }}
            >
                <span
                    style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background:
                            "var(--success)",
                        boxShadow:
                            "0 0 0 4px #27684f18",
                    }}
                />

                <span className="muted small">
                    Connected brand system
                </span>
            </div>
        </section>
    );
}

export { BrandHeader };
export type { BrandHeaderProps };
export default BrandHeader;