"use client";

interface InterviewPanelProps {
    questions: string[];
    answers: Record<string, string>;
    disabled?: boolean;
    onAnswer: (
        question: string,
        answer: string,
    ) => void;
}

export function InterviewPanel({
    questions,
    answers,
    disabled = false,
    onAnswer,
}: InterviewPanelProps) {
    if (questions.length === 0) {
        return null;
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
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "24px",
                    marginBottom: "12px",
                }}
            >
                <div>
                    <span className="eyebrow">
                        Founder interview
                    </span>

                    <h2
                        style={{
                            margin: "8px 0 0",
                            fontSize: "1.7rem",
                            lineHeight: 1.2,
                        }}
                    >
                        Clarify what matters.
                    </h2>
                </div>

                <div
                    aria-label={`${questions.length} questions`}
                    style={{
                        minWidth: "46px",
                        height: "46px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "14px",
                        background: "var(--bg)",
                        color: "var(--accent)",
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        boxShadow: "var(--inset-shadow)",
                    }}
                >
                    {questions.length}
                </div>
            </div>

            <p
                className="muted"
                style={{
                    maxWidth: "720px",
                    margin: 0,
                    lineHeight: 1.7,
                }}
            >
                These questions expose assumptions that should be resolved
                before the brand direction is developed.
            </p>

            <div
                style={{
                    display: "grid",
                    gap: "20px",
                    marginTop: "26px",
                }}
            >
                {questions.map((question, index) => (
                    <div
                        key={`${question}-${index}`}
                        style={{
                            padding: "20px",
                            borderRadius: "16px",
                            background: "var(--bg)",
                            boxShadow: "var(--raised)",
                            border: "1px solid #ffffff99",
                        }}
                    >
                        <label
                            htmlFor={`interview-${index}`}
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "13px",
                                marginBottom: "14px",
                                color: "var(--text)",
                                fontSize: "0.92rem",
                                fontWeight: 700,
                                lineHeight: 1.55,
                                cursor: disabled
                                    ? "default"
                                    : "text",
                            }}
                        >
                            <span
                                aria-hidden="true"
                                style={{
                                    flexShrink: 0,
                                    width: "32px",
                                    height: "32px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "10px",
                                    background:
                                        "var(--accent-soft)",
                                    color: "var(--accent-dark)",
                                    fontSize: "0.72rem",
                                    fontWeight: 800,
                                    boxShadow:
                                        "var(--small-shadow)",
                                }}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <span
                                style={{
                                    paddingTop: "5px",
                                }}
                            >
                                {question}
                            </span>
                        </label>

                        <textarea
                            id={`interview-${index}`}
                            value={answers[question] ?? ""}
                            onChange={(event) =>
                                onAnswer(
                                    question,
                                    event.target.value,
                                )
                            }
                            placeholder="Write the strongest answer you have right now."
                            rows={4}
                            disabled={disabled}
                            style={{
                                width: "100%",
                                minHeight: "112px",
                                resize: "vertical",
                                padding: "15px 16px",
                                borderRadius: "13px",
                                border: "1px solid var(--line)",
                                background: "var(--bg)",
                                color: "var(--text)",
                                font: "inherit",
                                fontSize: "0.86rem",
                                lineHeight: 1.65,
                                outline: "none",
                                boxShadow:
                                    "var(--inset-shadow)",
                                transition:
                                    "box-shadow 160ms ease, border-color 160ms ease",
                                boxSizing: "border-box",
                            }}
                            onFocus={(event) => {
                                event.currentTarget.style.borderColor =
                                    "var(--accent)";
                                event.currentTarget.style.boxShadow =
                                    "inset 3px 3px 8px #d1d8e2, inset -3px -3px 8px #ffffff, 0 0 0 3px var(--accent-soft)";
                            }}
                            onBlur={(event) => {
                                event.currentTarget.style.borderColor =
                                    "var(--line)";
                                event.currentTarget.style.boxShadow =
                                    "var(--inset-shadow)";
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}