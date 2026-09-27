"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "../lib/api";
import type {
    StageId,
    WorkflowInput,
    WorkflowRun,
} from "../lib/types";

interface UseWorkflowResult {
    runs: WorkflowRun[];
    loading: boolean;
    submitting: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    startStage: (
        stage: StageId,
        input: WorkflowInput,
    ) => Promise<WorkflowRun | null>;
    latestRun: (stage: StageId) => WorkflowRun | null;
}

function sortRuns(runs: WorkflowRun[]): WorkflowRun[] {
    return [...runs].sort((first, second) => {
        const firstTime = new Date(first.created_at).getTime();
        const secondTime = new Date(second.created_at).getTime();

        return secondTime - firstTime;
    });
}

export function useWorkflow(
    projectId: string | null | undefined,
): UseWorkflowResult {
    const [runs, setRuns] = useState<WorkflowRun[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!projectId) {
            setRuns([]);
            setLoading(false);
            setError("Project ID is missing.");
            return;
        }

        try {
            const result = await api.getRuns(projectId);
            setRuns(sortRuns(result));
            setError(null);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                        ? err.message
                        : "Could not load workflow history.";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const startStage = useCallback(
        async (
            stage: StageId,
            input: WorkflowInput,
        ): Promise<WorkflowRun | null> => {
            if (!projectId) {
                setError("Project ID is missing.");
                return null;
            }

            setSubmitting(true);
            setError(null);

            try {
                const run = await api.startWorkflow(
                    projectId,
                    stage,
                    input,
                );

                setRuns((current) =>
                    sortRuns([
                        run,
                        ...current.filter(
                            (existing) => existing.id !== run.id,
                        ),
                    ]),
                );

                return run;
            } catch (err) {
                const message =
                    err instanceof ApiError
                        ? err.message
                        : err instanceof Error
                            ? err.message
                            : "Could not start the workflow.";

                setError(message);
                return null;
            } finally {
                setSubmitting(false);
            }
        },
        [projectId],
    );

    const latestRun = useMemo(() => {
        const cache = new Map<
            StageId,
            WorkflowRun | null
        >();

        for (const run of runs) {
            if (!cache.has(run.stage)) {
                cache.set(run.stage, run);
            }
        }

        return (stage: StageId): WorkflowRun | null =>
            cache.get(stage) ?? null;
    }, [runs]);

    return {
        runs,
        loading,
        submitting,
        error,
        refresh,
        startStage,
        latestRun,
    };
}