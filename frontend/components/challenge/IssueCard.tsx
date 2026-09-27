"use client";

export interface BrandIssue {
    title: string;
    description: string;
    severity?: "low" | "medium" | "high";
    category?: string;
    recommendation?: string;
}

interface IssueCardProps {
    issue: BrandIssue;
}

export function IssueCard({
    issue,
}: IssueCardProps) {
    const severity =
        issue.severity ?? "medium";

    const severityLabel =
        severity === "high"
            ? "High attention"
            : severity === "medium"
                ? "Review"
                : "Low attention";

    return (
        <article
            className="surface"
            style={{
                padding: "22px",
                borderRadius: "15px",
                border: "1px solid #ffffff99",
                boxShadow: "var(--raised)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent:
                        "space-between",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        minWidth: 0,
                    }}
                >
                    {issue.category ? (
                        <span className="eyebrow">
                            {issue.category}
                        </span>
                    ) : null}

                    <h3
                        style={{
                            marginTop:
                                issue.category
                                    ? "5px"
                                    : 0,
                            fontSize: "1.05rem",
                            lineHeight: 1.4,
                        }}
                    >
                        {issue.title}
                    </h3>
                </div>

                <span
                    style={{
                        display:
                            "inline-flex",
                        alignItems:
                            "center",
                        gap: "7px",
                        flexShrink: 0,
                        padding: "7px 11px",
                        borderRadius:
                            "999px",
                        background:
                            "var(--bg)",
                        boxShadow:
                            "var(--small-shadow)",
                        color:
                            "var(--text)",
                        fontSize:
                            "0.65rem",
                        fontWeight: 750,
                        letterSpacing:
                            "0.05em",
                        textTransform:
                            "uppercase",
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
                                severity ===
                                    "high"
                                    ? "var(--danger)"
                                    : severity ===
                                        "medium"
                                        ? "var(--warning)"
                                        : "var(--success)",
                        }}
                    />

                    {severityLabel}
                </span>
            </div>

            <p
                className="muted"
                style={{
                    marginTop: "14px",
                    fontSize: "0.83rem",
                    lineHeight: 1.7,
                }}
            >
                {issue.description}
            </p>

            {issue.recommendation ? (
                <div
                    style={{
                        marginTop: "18px",
                        padding: "17px",
                        borderRadius:
                            "12px",
                        background:
                            "var(--bg)",
                        boxShadow:
                            "var(--inset-shadow)",
                    }}
                >
                    <span className="eyebrow">
                        Recommendation
                    </span>

                    <p
                        style={{
                            marginTop:
                                "7px",
                            fontSize:
                                "0.8rem",
                            lineHeight:
                                1.65,
                        }}
                    >
                        {issue.recommendation}
                    </p>
                </div>
            ) : null}
        </article>
    );
}