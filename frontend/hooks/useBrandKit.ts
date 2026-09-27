"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";
import type {
    BrandState,
    DataRecord,
} from "../lib/types";

interface UseBrandKitResult {
    brand: BrandState | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    save: (data: DataRecord) => Promise<BrandState | null>;
}

export function useBrandKit(
    projectId: string | null | undefined,
): UseBrandKitResult {
    const [brand, setBrand] = useState<BrandState | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        if (!projectId) {
            setBrand(null);
            setLoading(false);
            setError("Project ID is missing.");
            return;
        }

        setLoading(true);

        try {
            const result = await api.getBrand(projectId);
            setBrand(result);
            setError(null);
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                        ? err.message
                        : "Could not load the brand state.";

            setError(message);
            setBrand(null);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const save = useCallback(
        async (data: DataRecord): Promise<BrandState | null> => {
            if (!projectId) {
                setError("Project ID is missing.");
                return null;
            }

            setSaving(true);
            setError(null);

            try {
                const result = await api.updateBrand(
                    projectId,
                    data,
                );

                setBrand(result);
                return result;
            } catch (err) {
                const message =
                    err instanceof ApiError
                        ? err.message
                        : err instanceof Error
                            ? err.message
                            : "Could not save the brand state.";

                setError(message);
                return null;
            } finally {
                setSaving(false);
            }
        },
        [projectId],
    );

    return {
        brand,
        loading,
        saving,
        error,
        refresh,
        save,
    };
}