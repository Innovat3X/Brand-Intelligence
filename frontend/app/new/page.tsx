"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";

const workflowSteps = [
    {
        number: "01",
        title: "Discover",
        description: "Understand the idea, audience, problem, and opportunity.",
    },
    {
        number: "02",
        title: "Position",
        description: "Clarify who the brand is for and why it should matter.",
    },
    {
        number: "03",
        title: "Shape",
        description: "Turn strategic thinking into a coherent brand direction.",
    },
    {
        number: "04",
        title: "Visualize",
        description: "Explore the visual language and identity system.",
    },
    {
        number: "05",
        title: "Challenge",
        description: "Stress-test decisions before they become commitments.",
    },
    {
        number: "06",
        title: "Deliver",
        description: "Bring everything together into a usable brand system.",
    },
];

export default function NewProjectPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [idea, setIdea] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedIdea = idea.trim();

        if (!trimmedName) {
            setError("Enter a project name.");
            return;
        }

        if (!trimmedIdea) {
            setError("Describe your idea before continuing.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const project = await api.createProject({
                name: trimmedName,
                idea: trimmedIdea,
            });

            router.push(
                `/project/${encodeURIComponent(project.id)}/discovery`,
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not create the project.",
            );
            setSubmitting(false);
        }
    }

    return (
        <main>
            <div className="site-container">
                <header className="site-header">
                    <Link
                        href="/"
                        className="brand-lockup"
                        aria-label="Brand Intelligence home"
                    >
                        <span className="brand-mark" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <span />
                        </span>

                        <span>
                            <strong>Brand Intelligence</strong>
                            <small className="muted">
                                Connected brand thinking
                            </small>
                        </span>
                    </Link>

                    <nav aria-label="Project navigation">
                        <Link href="/" className="text-link">
                            Home
                        </Link>

                        <Link href="/" className="button">
                            Back
                        </Link>
                    </nav>
                </header>

                <section className="new-project-page">
                    <div className="new-project-heading">
                        <span className="eyebrow">Start a brand</span>

                        <h1>Turn your rough idea into a brand.</h1>

                        <p>
                            Begin with the idea as it exists today. Brand
                            Intelligence carries the context forward as you
                            move from discovery to positioning, shaping,
                            visualization, challenge, and delivery.
                        </p>
                    </div>

                    <div className="new-project-grid">
                        <section className="surface">
                            <form className="stack" onSubmit={handleSubmit}>
                                <div>
                                    <span className="eyebrow">
                                        Project foundation
                                    </span>

                                    <h2>Start with the essentials.</h2>

                                    <p className="muted">
                                        Give the project a name and describe
                                        what you are building. You can refine
                                        the direction later.
                                    </p>
                                </div>

                                <div className="field">
                                    <label htmlFor="project-name">
                                        Project name
                                    </label>

                                    <input
                                        id="project-name"
                                        name="project-name"
                                        type="text"
                                        value={name}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="e.g. EcoNest"
                                        maxLength={100}
                                        disabled={submitting}
                                        autoComplete="off"
                                    />

                                    <span className="muted small">
                                        A working name is enough for now.
                                    </span>
                                </div>

                                <div className="field">
                                    <label htmlFor="project-idea">
                                        Your idea
                                    </label>

                                    <textarea
                                        id="project-idea"
                                        name="project-idea"
                                        value={idea}
                                        onChange={(event) =>
                                            setIdea(event.target.value)
                                        }
                                        placeholder="What are you building, who is it for, and what problem does it solve?"
                                        rows={8}
                                        maxLength={2000}
                                        disabled={submitting}
                                    />

                                    <div
                                        className="button-row"
                                        style={{
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <span className="muted small">
                                            Your starting context guides the
                                            discovery stage.
                                        </span>

                                        <span className="muted small">
                                            {idea.length}/2000
                                        </span>
                                    </div>
                                </div>

                                {error ? (
                                    <div
                                        className="notice error-notice"
                                        role="alert"
                                    >
                                        <div>
                                            <strong>Something needs attention</strong>
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                ) : null}

                                <div className="button-row">
                                    <button
                                        type="submit"
                                        className="button primary"
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? "Creating project..."
                                            : "Start discovery →"}
                                    </button>

                                    <Link href="/" className="text-link">
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </section>

                        <aside className="surface">
                            <div>
                                <span className="eyebrow">
                                    The workflow
                                </span>

                                <h2>One idea. Six connected stages.</h2>

                                <p className="muted small">
                                    Your decisions stay connected as the brand
                                    takes shape.
                                </p>
                            </div>

                            <ol
                                className="workflow-preview"
                                style={{ marginTop: "12px" }}
                            >
                                {workflowSteps.map((step) => (
                                    <li
                                        key={step.number}
                                        className="preview-step"
                                    >
                                        <span
                                            className="preview-number"
                                            aria-hidden="true"
                                        >
                                            {step.number}
                                        </span>

                                        <div>
                                            <strong>{step.title}</strong>
                                            <p>{step.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>

                            <div className="notice">
                                <div>
                                    <strong>Context stays connected</strong>
                                    <p>
                                        What you establish early can inform
                                        the decisions that follow.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <footer className="site-footer">
                    <span>Brand Intelligence</span>
                    <span>From rough idea to connected brand system.</span>
                </footer>
            </div>
        </main>
    );
}