"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
    STAGES,
    completedStageIds,
    stageUrl,
} from "../../lib/brand";
import { useWorkflow } from "../../hooks/useWorkflow";

export function WorkflowStepper() {
    const params = useParams<{ id?: string }>();
    const pathname = usePathname();

    const projectId = params?.id ?? null;

    const { runs, loading } = useWorkflow(projectId);

    const completed = new Set(
        completedStageIds(runs),
    );

    const currentIndex = STAGES.findIndex((stage) => {
        if (!pathname) {
            return false;
        }

        return (
            pathname.endsWith(`/${stage.route}`) ||
            pathname.endsWith(`/${stage.id}`)
        );
    });

    return (
        <div
            className="workflow-stepper"
            aria-label="Brand workflow progress"
        >
            {STAGES.map((stage, index) => {
                const href = projectId
                    ? stageUrl(projectId, stage.id)
                    : "#";

                const active = index === currentIndex;
                const isComplete = completed.has(stage.id);

                let state = "upcoming";

                if (isComplete) {
                    state = "complete";
                } else if (active) {
                    state = "active";
                }

                return (
                    <div
                        key={stage.id}
                        className={`workflow-step workflow-step-${state}`}
                    >
                        <Link
                            href={href}
                            className="workflow-step-link"
                            aria-current={
                                active ? "step" : undefined
                            }
                        >
                            <span className="workflow-step-marker">
                                {isComplete ? "✓" : stage.number}
                            </span>

                            <span className="workflow-step-label">
                                {stage.label}
                            </span>
                        </Link>

                        {index < STAGES.length - 1 ? (
                            <span
                                className="workflow-step-line"
                                aria-hidden="true"
                            />
                        ) : null}
                    </div>
                );
            })}

            {loading ? (
                <span className="workflow-stepper-loading">
                    Loading progress…
                </span>
            ) : null}
        </div>
    );
}