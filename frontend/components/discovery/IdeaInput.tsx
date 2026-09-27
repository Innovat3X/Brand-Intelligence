"use client";

import type { FormEvent } from "react";
import { useState } from "react";

interface IdeaInputProps {
    initialIdea?: string;
    disabled?: boolean;
    onSubmit: (idea: string) => void | Promise<void>;
}

export function IdeaInput({
    initialIdea = "",
    disabled = false,
    onSubmit,
}: IdeaInputProps) {
    const [idea, setIdea] = useState(initialIdea);
    const [error, setError] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const value = idea.trim();

        if (!value) {
            setError(
                "Describe the idea before starting discovery.",
            );
            return;
        }

        setError("");
        await onSubmit(value);
    }

    return (
        <section
            className="surface"
            style={{
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
                        Start here
                    </span>

                    <h2>
                        Tell us about the idea.
                    </h2>

                    <p
                        className="muted"
                        style={{
                            maxWidth: "720px",
                            marginTop: "9px",
                            lineHeight: 1.7,
                        }}
                    >
                        Give the system the rough version of
                        the idea. It does not need to be polished.
                        Discovery will turn it into a clearer
                        problem, audience, context, and
                        opportunity.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-hidden="true"
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow:
                            "var(--small-shadow)",
                    }}
                >
                    01
                </span>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    marginTop: "28px",
                }}
            >
                <div className="field">
                    <label htmlFor="discovery-idea">
                        Your rough idea
                    </label>

                    <textarea
                        id="discovery-idea"
                        value={idea}
                        onChange={(event) =>
                            setIdea(event.target.value)
                        }
                        placeholder="Example: I want to build a platform that helps college students find reliable teammates for projects and hackathons."
                        rows={8}
                        maxLength={4000}
                        disabled={disabled}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "14px",
                        flexWrap: "wrap",
                    }}
                >
                    <span className="muted small">
                        {idea.length}/4000 characters
                    </span>

                    <span className="muted small">
                        Start rough. Refine later.
                    </span>
                </div>

                {error ? (
                    <div
                        className="notice error-notice"
                        role="alert"
                    >
                        <div>
                            <strong>
                                A little more context is needed.
                            </strong>

                            <p>{error}</p>
                        </div>
                    </div>
                ) : null}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "16px",
                        paddingTop: "4px",
                        flexWrap: "wrap",
                    }}
                >
                    <span className="muted small">
                        Your input becomes the foundation for
                        Stage 01.
                    </span>

                    <button
                        type="submit"
                        className="button primary"
                        disabled={disabled}
                    >
                        {disabled
                            ? "Discovery is running..."
                            : "Analyze the idea →"}
                    </button>
                </div>
            </form>
        </section>
    );
}