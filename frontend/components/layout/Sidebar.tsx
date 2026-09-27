"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { STAGES, completedStageIds, stageUrl } from "../../lib/brand";
import { useWorkflow } from "../../hooks/useWorkflow";

export function Sidebar() {
    const params = useParams<{ id?: string }>();
    const pathname = usePathname();

    const projectId = params?.id ?? null;

    const { runs } = useWorkflow(projectId);

    const completed = new Set(
        completedStageIds(runs),
    );

    return (
        <aside className="app-sidebar">
            <div className="sidebar-header">
                <span className="section-eyebrow">
                    Brand workflow
                </span>

                <h2>Your brand</h2>
            </div>

            <nav
                className="sidebar-navigation"
                aria-label="Brand workflow stages"
            >
                {STAGES.map((stage) => {
                    const href = projectId
                        ? stageUrl(projectId, stage.id)
                        : "#";

                    const active =
                        pathname === href ||
                        pathname.endsWith(`/${stage.route}`);

                    const isComplete = completed.has(stage.id);

                    return (
                        <Link
                            key={stage.id}
                            href={href}
                            className={`sidebar-stage ${active ? "sidebar-stage-active" : ""
                                } ${isComplete
                                    ? "sidebar-stage-complete"
                                    : ""
                                }`}
                        >
                            <span className="sidebar-stage-number">
                                {isComplete ? "✓" : stage.number}
                            </span>

                            <span className="sidebar-stage-copy">
                                <span className="sidebar-stage-eyebrow">
                                    {stage.eyebrow}
                                </span>

                                <span className="sidebar-stage-label">
                                    {stage.label}
                                </span>
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <Link
                    href="/"
                    className="sidebar-home-link"
                >
                    ← Back home
                </Link>
            </div>
        </aside>
    );
}