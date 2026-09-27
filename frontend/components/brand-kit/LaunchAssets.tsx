"use client";

export interface LaunchAsset {
    name: string;
    description: string;
    priority?: "now" | "next" | "later";
}

interface LaunchAssetsProps {
    assets: LaunchAsset[];
}

export function LaunchAssets({
    assets,
}: LaunchAssetsProps) {
    const visibleAssets = assets.filter(
        (asset) =>
            asset.name.trim().length > 0 ||
            asset.description.trim().length > 0,
    );

    const priorityLabels = {
        now: "Now",
        next: "Next",
        later: "Later",
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
                        Launch assets
                    </span>

                    <h2>
                        Turn the identity into action.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        These are the practical assets needed to
                        take the completed brand into its first
                        launch context.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${visibleAssets.length} launch assets`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow:
                            "var(--small-shadow)",
                    }}
                >
                    {visibleAssets.length}
                </span>
            </div>

            {visibleAssets.length === 0 ? (
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
                        No launch assets have been generated yet.
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gap: "16px",
                        marginTop: "28px",
                    }}
                >
                    {visibleAssets.map(
                        (asset, index) => (
                            <article
                                key={`${asset.name}-${index}`}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "48px minmax(0, 1fr)",
                                    gap: "18px",
                                    padding: "20px",
                                    borderRadius: "15px",
                                    background: "var(--bg)",
                                    boxShadow:
                                        "var(--raised)",
                                    border:
                                        "1px solid #ffffff99",
                                }}
                            >
                                <span
                                    style={{
                                        display: "grid",
                                        width: "48px",
                                        height: "48px",
                                        placeItems: "center",
                                        borderRadius: "14px",
                                        background:
                                            "var(--bg)",
                                        boxShadow:
                                            "var(--small-shadow)",
                                        color:
                                            "var(--accent-dark)",
                                        fontSize:
                                            "0.7rem",
                                        fontWeight: 750,
                                    }}
                                >
                                    {String(
                                        index + 1,
                                    ).padStart(2, "0")}
                                </span>

                                <div
                                    style={{
                                        minWidth: 0,
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
                                                minWidth: 0,
                                            }}
                                        >
                                            <h3
                                                style={{
                                                    fontSize:
                                                        "1rem",
                                                    lineHeight:
                                                        1.4,
                                                }}
                                            >
                                                {asset.name}
                                            </h3>

                                            {asset.description ? (
                                                <p
                                                    className="muted"
                                                    style={{
                                                        marginTop:
                                                            "7px",
                                                        fontSize:
                                                            "0.81rem",
                                                        lineHeight:
                                                            1.65,
                                                    }}
                                                >
                                                    {
                                                        asset.description
                                                    }
                                                </p>
                                            ) : null}
                                        </div>

                                        {asset.priority ? (
                                            <span
                                                style={{
                                                    flexShrink:
                                                        0,
                                                    padding:
                                                        "7px 10px",
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
                                                {
                                                    priorityLabels[
                                                    asset.priority
                                                    ]
                                                }
                                            </span>
                                        ) : null}
                                    </div>

                                    <div
                                        style={{
                                            width: "100%",
                                            height: "1px",
                                            margin:
                                                "16px 0 0",
                                            background:
                                                "var(--line)",
                                        }}
                                    />

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: "8px",
                                            marginTop:
                                                "12px",
                                        }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            style={{
                                                width: "7px",
                                                height: "7px",
                                                borderRadius:
                                                    "50%",
                                                background:
                                                    asset.priority ===
                                                        "now"
                                                        ? "var(--accent)"
                                                        : "var(--muted)",
                                            }}
                                        />

                                        <span className="muted small">
                                            {asset.priority
                                                ? `Priority: ${priorityLabels[
                                                asset.priority
                                                ]}`
                                                : "Priority not specified"}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ),
                    )}
                </div>
            )}
        </section>
    );
}