"use client";

import {
    IssueCard,
    type BrandIssue,
} from "./IssueCard";

interface CritiquePanelProps {
    summary?: string;
    issues: BrandIssue[];
    strengths?: string[];
    recommendations?: string[];
}

export function CritiquePanel({
    summary,
    issues,
    strengths = [],
    recommendations = [],
}: CritiquePanelProps) {
    const visibleStrengths = strengths.filter(
        (strength) => strength.trim().length > 0,
    );

    const visibleRecommendations =
        recommendations.filter(
            (recommendation) =>
                recommendation.trim().length > 0,
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
                        Brand critique
                    </span>

                    <h2>
                        Stress-test the identity.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        Challenge the decisions before treating
                        the identity as launch-ready.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${issues.length} identified issues`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow:
                            "var(--small-shadow)",
                    }}
                >
                    {issues.length}
                </span>
            </div>

            {summary ? (
                <div
                    style={{
                        marginTop: "28px",
                        padding: "22px",
                        borderRadius: "15px",
                        background: "var(--bg)",
                        boxShadow: "var(--inset-shadow)",
                    }}
                >
                    <span className="eyebrow">
                        Overall assessment
                    </span>

                    <p
                        style={{
                            marginTop: "8px",
                            lineHeight: 1.75,
                        }}
                    >
                        {summary}
                    </p>
                </div>
            ) : null}

            {visibleStrengths.length > 0 ? (
                <div
                    style={{
                        marginTop: "28px",
                        padding: "22px",
                        borderRadius: "15px",
                        background: "var(--bg)",
                        boxShadow: "var(--raised)",
                        border: "1px solid #ffffff99",
                    }}
                >
                    <span className="eyebrow">
                        What is working
                    </span>

                    <div
                        style={{
                            display: "grid",
                            gap: "10px",
                            marginTop: "14px",
                        }}
                    >
                        {visibleStrengths.map(
                            (strength) => (
                                <div
                                    key={strength}
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "flex-start",
                                        gap: "12px",
                                        padding:
                                            "13px 15px",
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
                                            display:
                                                "grid",
                                            width:
                                                "26px",
                                            height:
                                                "26px",
                                            flexShrink:
                                                0,
                                            placeItems:
                                                "center",
                                            borderRadius:
                                                "50%",
                                            background:
                                                "var(--accent-soft)",
                                            color:
                                                "var(--accent-dark)",
                                            fontSize:
                                                "0.72rem",
                                            fontWeight:
                                                800,
                                        }}
                                    >
                                        ✓
                                    </span>

                                    <p
                                        style={{
                                            paddingTop:
                                                "3px",
                                            fontSize:
                                                "0.82rem",
                                            lineHeight:
                                                1.6,
                                        }}
                                    >
                                        {strength}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            ) : null}

            <div
                style={{
                    marginTop: "28px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        gap: "16px",
                        marginBottom:
                            "16px",
                    }}
                >
                    <div>
                        <span className="eyebrow">
                            Areas to review
                        </span>

                        <h3
                            style={{
                                marginTop: "4px",
                            }}
                        >
                            What could weaken the brand?
                        </h3>
                    </div>

                    <span className="muted small">
                        {issues.length}{" "}
                        {issues.length === 1
                            ? "issue"
                            : "issues"}
                    </span>
                </div>

                {issues.length > 0 ? (
                    <div
                        style={{
                            display: "grid",
                            gap: "18px",
                        }}
                    >
                        {issues.map(
                            (issue, index) => (
                                <IssueCard
                                    key={`${issue.title}-${index}`}
                                    issue={issue}
                                />
                            ),
                        )}
                    </div>
                ) : (
                    <div
                        style={{
                            padding: "24px",
                            borderRadius: "14px",
                            background:
                                "var(--bg)",
                            boxShadow:
                                "var(--inset-shadow)",
                            textAlign:
                                "center",
                        }}
                    >
                        <p className="muted">
                            No issues have been
                            identified yet.
                        </p>
                    </div>
                )}
            </div>

            {visibleRecommendations.length > 0 ? (
                <div
                    style={{
                        marginTop: "28px",
                        padding: "22px",
                        borderRadius: "15px",
                        background: "var(--bg)",
                        boxShadow: "var(--raised)",
                        border:
                            "1px solid #ffffff99",
                    }}
                >
                    <span className="eyebrow">
                        Recommended next actions
                    </span>

                    <ol
                        style={{
                            display: "grid",
                            gap: "12px",
                            margin:
                                "16px 0 0",
                            paddingLeft: "24px",
                        }}
                    >
                        {visibleRecommendations.map(
                            (
                                recommendation,
                                index,
                            ) => (
                                <li
                                    key={
                                        recommendation
                                    }
                                    style={{
                                        padding:
                                            "13px 15px",
                                        borderRadius:
                                            "11px",
                                        background:
                                            "var(--bg)",
                                        boxShadow:
                                            "var(--inset-shadow)",
                                        fontSize:
                                            "0.82rem",
                                        lineHeight:
                                            1.6,
                                    }}
                                >
                                    {recommendation}
                                </li>
                            ),
                        )}
                    </ol>
                </div>
            ) : null}
        </section>
    );
}