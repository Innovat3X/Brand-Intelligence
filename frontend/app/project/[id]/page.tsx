"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectPage() {
    const router = useRouter();
    const params = useParams<{ id?: string }>();
    const projectId = params?.id;

    useEffect(() => {
        if (projectId) {
            router.replace(
                `/project/${encodeURIComponent(projectId)}/discovery`,
            );
        }
    }, [projectId, router]);

    return (
        <main>
            <div className="site-container">
                <section
                    className="surface"
                    style={{
                        maxWidth: "760px",
                        minHeight: "360px",
                        margin: "80px auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <div
                        className="stack"
                        style={{
                            alignItems: "center",
                            maxWidth: "520px",
                        }}
                    >
                        <span className="eyebrow">
                            Brand Intelligence
                        </span>

                        <div
                            aria-hidden="true"
                            style={{
                                width: "58px",
                                height: "58px",
                                margin: "8px 0",
                                borderRadius: "50%",
                                background: "var(--bg)",
                                boxShadow:
                                    "var(--inset-shadow)",
                            }}
                        />

                        <h1>
                            Opening your brand workspace
                        </h1>

                        <p className="muted">
                            Loading the first stage of the
                            workflow.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}