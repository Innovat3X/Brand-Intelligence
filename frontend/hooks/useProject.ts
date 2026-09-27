"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";
import type { Project } from "../lib/types";

interface UseProjectResult {
    project: Project | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useProject(
    projectId: string | null | undefined,
): UseProjectResult {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!projectId) {
            setProject(null);
            setLoading(false);
            setError("Project ID is missing.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await api.getProject(projectId);
            setProject(result);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                        ? err.message
                        : "Could not load the project.";

            setError(message);
            setProject(null);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return {
        project,
        loading,
        error,
        refresh,
    };
}