"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    DirectionSelector,
    type PositioningDirection,
} from "../../../../components/positioning/DirectionSelector";

import { useBrandKit } from "../../../../hooks/useBrandKit";
import { useProject } from "../../../../hooks/useProject";
import { useWorkflow } from "../../../../hooks/useWorkflow";

import {
    buildStageInput,
    getStageData,
    isRecord,
} from "../../../../lib/brand";

function readString(
    value: unknown,
): string | undefined {
    if (
        typeof value === "string" &&
        value.trim().length > 0
    ) {
        return value.trim();
    }

    return undefined;
}

function normalizeDirections(
    value: unknown,
): PositioningDirection[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .filter(isRecord)
        .map(
            (
                item,
                index,
            ): PositioningDirection => ({
                id:
                    readString(item.id) ??
                    readString(item.key) ??
                    `direction-${index + 1}`,

                title:
                    readString(item.title) ??
                    readString(item.name) ??
                    `Direction ${index + 1}`,

                description:
                    readString(
                        item.description,
                    ) ??
                    readString(item.summary) ??
                    "No description was provided.",

                rationale:
                    readString(
                        item.rationale,
                    ) ??
                    readString(item.reasoning),

                differentiator:
                    readString(
                        item.differentiator,
                    ) ??
                    readString(item.difference),

                valueProposition:
                    readString(
                        item.value_proposition,
                    ) ??
                    readString(
                        item.valueProposition,
                    ),
            }),
        );
}

function unwrapWorkflowOutput(
    value: unknown,
): Record<string, unknown> {
    if (!isRecord(value)) {
        return {};
    }

    if (isRecord(value.result)) {
        return value.result;
    }

    return value;
}

export default function PositioningPage() {
    const router = useRouter();

    const params = useParams<{
        id?: string;
    }>();

    const projectId =
        params?.id ?? null;

    const {
        project,
        loading: projectLoading,
        error: projectError,
    } = useProject(projectId);

    const {
        brand,
        loading: brandLoading,
        error: brandError,
    } = useBrandKit(projectId);

    const {
        startStage,
        latestRun,
        submitting,
        error: workflowError,
    } = useWorkflow(projectId);

    const positioningRun =
        latestRun("positioning");

    const positioningData: Record<
        string,
        unknown
    > = useMemo(() => {
        if (
            positioningRun?.output_data
        ) {
            return unwrapWorkflowOutput(
                positioningRun.output_data,
            );
        }

        const storedData =
            getStageData(
                brand?.data,
                "positioning",
            );

        return isRecord(storedData)
            ? storedData
            : {};
    }, [
        positioningRun?.output_data,
        brand?.data,
    ]);

    const directions = useMemo(
        () => {
            const candidates =
                positioningData.directions ??
                positioningData.positioning_directions ??
                positioningData.options;

            return normalizeDirections(
                candidates,
            );
        },
        [positioningData],
    );

    const [
        selectedDirectionId,
        setSelectedDirectionId,
    ] = useState<string | null>(null);

    const selectedDirection =
        directions.find(
            (direction) =>
                direction.id ===
                selectedDirectionId,
        ) ?? null;

    const handleGenerate =
        async () => {
            if (!project) {
                return;
            }

            await startStage(
                "positioning",
                buildStageInput(
                    project.idea,
                    brand?.data,
                    {},
                    "Develop several meaningful positioning directions from the current discovery context. Each direction should make a distinct strategic choice about audience, value, differentiation, and market position. Return structured positioning directions with clear reasoning.",
                ),
            );
        };

    const handleSelect = (
        direction: PositioningDirection,
    ) => {
        setSelectedDirectionId(
            direction.id,
        );
    };

    const handleContinue =
        () => {
            if (
                !project ||
                !selectedDirection
            ) {
                return;
            }

            router.push(
                `/project/${encodeURIComponent(
                    project.id,
                )}/shape`,
            );
        };

    if (
        projectLoading ||
        brandLoading
    ) {
        return (
            <section className="stage-page">
                <div className="stage-loading">
                    <span className="section-eyebrow">
                        Stage 02 · Position
                    </span>

                    <h1>
                        Loading positioning…
                    </h1>

                    <p>
                        Restoring discovery context
                        before making the strategic
                        choice.
                    </p>
                </div>
            </section>
        );
    }

    if (!project) {
        return (
            <section className="stage-page">
                <div className="stage-error">
                    <span className="section-eyebrow">
                        Project unavailable
                    </span>

                    <h1>
                        We could not load this
                        project.
                    </h1>

                    <p>
                        {projectError ??
                            "The requested project could not be found."}
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                            router.push("/")
                        }
                    >
                        Back to home
                    </button>
                </div>
            </section>
        );
    }

    const isRunning =
        submitting ||
        positioningRun?.status ===
        "pending" ||
        positioningRun?.status ===
        "running";

    return (
        <section className="stage-page">
            <div className="stage-hero">
                <div>
                    <span className="section-eyebrow">
                        Stage 02 · Position
                    </span>

                    <h1>
                        Choose a strategic direction.
                    </h1>

                    <p>
                        Positioning turns the discovery
                        work into an explicit choice
                        about who the brand serves,
                        what it promises, and why it
                        should be different.
                    </p>
                </div>

                <div className="stage-principle">
                    <span>
                        Principle
                    </span>

                    <strong>
                        Make the strategic choice
                        explicit.
                    </strong>
                </div>
            </div>

            {workflowError ||
                brandError ? (
                <div
                    className="form-error"
                    role="alert"
                >
                    {workflowError ??
                        brandError}
                </div>
            ) : null}

            {directions.length === 0 ? (
                <section className="stage-card">
                    <div className="stage-card-header">
                        <div>
                            <span className="section-eyebrow">
                                Strategic exploration
                            </span>

                            <h2>
                                Generate positioning
                                directions.
                            </h2>
                        </div>

                        <span className="stage-card-index">
                            02
                        </span>
                    </div>

                    <p className="stage-card-description">
                        The system will use the
                        accumulated discovery context
                        to develop distinct strategic
                        directions rather than giving
                        you one generic positioning
                        statement.
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        disabled={isRunning}
                        onClick={
                            handleGenerate
                        }
                    >
                        {isRunning
                            ? "Positioning is running..."
                            : "Generate directions →"}
                    </button>
                </section>
            ) : (
                <>
                    <DirectionSelector
                        directions={
                            directions
                        }
                        selectedId={
                            selectedDirectionId
                        }
                        disabled={isRunning}
                        onSelect={
                            handleSelect
                        }
                    />

                    <div className="stage-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            disabled={isRunning}
                            onClick={
                                handleGenerate
                            }
                        >
                            {isRunning
                                ? "Running..."
                                : "Explore again"}
                        </button>

                        <button
                            type="button"
                            className="primary-button"
                            disabled={
                                isRunning ||
                                !selectedDirection
                            }
                            onClick={
                                handleContinue
                            }
                        >
                            Continue to shaping →
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}