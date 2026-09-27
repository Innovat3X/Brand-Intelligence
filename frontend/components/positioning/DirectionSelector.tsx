"use client";

import { useMemo, useState } from "react";
import { isRecord } from "../../lib/brand";
import { PositioningCard } from "./PositioningCard";

export interface PositioningDirection {
    id: string;
    title: string;
    description: string;
    rationale?: string;
    differentiator?: string;
    valueProposition?: string;
}

interface DirectionSelectorProps {
    directions: PositioningDirection[];
    selectedId?: string | null;
    disabled?: boolean;
    onSelect: (direction: PositioningDirection) => void;
}

function normalizeDirection(
    value: unknown,
    index: number,
): PositioningDirection | null {
    if (!isRecord(value)) {
        return null;
    }

    const title =
        typeof value.title === "string"
            ? value.title
            : typeof value.name === "string"
                ? value.name
                : `Direction ${index + 1}`;

    const description =
        typeof value.description === "string"
            ? value.description
            : typeof value.summary === "string"
                ? value.summary
                : "";

    const rationale =
        typeof value.rationale === "string"
            ? value.rationale
            : typeof value.reasoning === "string"
                ? value.reasoning
                : undefined;

    const differentiator =
        typeof value.differentiator === "string"
            ? value.differentiator
            : typeof value.difference === "string"
                ? value.difference
                : undefined;

    const valueProposition =
        typeof value.value_proposition === "string"
            ? value.value_proposition
            : typeof value.valueProposition === "string"
                ? value.valueProposition
                : undefined;

    return {
        id:
            typeof value.id === "string"
                ? value.id
                : `direction-${index + 1}`,
        title,
        description,
        rationale,
        differentiator,
        valueProposition,
    };
}

export function DirectionSelector({
    directions,
    selectedId = null,
    disabled = false,
    onSelect,
}: DirectionSelectorProps) {
    const [activeId, setActiveId] = useState(
        selectedId,
    );

    const normalizedDirections = useMemo(
        () =>
            directions
                .map(normalizeDirection)
                .filter(
                    (
                        direction,
                    ): direction is PositioningDirection =>
                        direction !== null,
                ),
        [directions],
    );

    if (normalizedDirections.length === 0) {
        return (
            <section
                className="surface"
                style={{
                    padding: "36px",
                    marginBottom: "30px",
                }}
            >
                <div>
                    <span className="eyebrow">
                        Positioning
                    </span>

                    <h2>No directions yet.</h2>

                    <p
                        className="muted"
                        style={{
                            marginTop: "9px",
                            maxWidth: "620px",
                            lineHeight: 1.7,
                        }}
                    >
                        Run the positioning stage to generate
                        strategic directions.
                    </p>
                </div>
            </section>
        );
    }

    function handleSelect(
        direction: PositioningDirection,
    ) {
        setActiveId(direction.id);
        onSelect(direction);
    }

    return (
        <section
            className="surface"
            style={{
                padding: "32px",
                marginBottom: "30px",
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
                        Make the strategic choice
                    </span>

                    <h2>
                        Which direction fits the opportunity?
                    </h2>

                    <p
                        className="muted"
                        style={{
                            marginTop: "9px",
                            maxWidth: "720px",
                            lineHeight: 1.7,
                        }}
                    >
                        Compare the directions before continuing.
                        The selected direction becomes context for
                        the Shape stage.
                    </p>
                </div>

                <span
                    className="preview-number"
                    aria-label={`${normalizedDirections.length} directions available`}
                    style={{
                        width: "46px",
                        height: "46px",
                        flexShrink: 0,
                        boxShadow:
                            "var(--small-shadow)",
                    }}
                >
                    {normalizedDirections.length}
                </span>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(270px, 1fr))",
                    gap: "24px",
                    marginTop: "30px",
                }}
            >
                {normalizedDirections.map(
                    (direction) => (
                        <PositioningCard
                            key={direction.id}
                            title={direction.title}
                            description={
                                direction.description
                            }
                            rationale={
                                direction.rationale
                            }
                            differentiator={
                                direction.differentiator
                            }
                            valueProposition={
                                direction.valueProposition
                            }
                            selected={
                                activeId ===
                                direction.id
                            }
                            disabled={disabled}
                            onSelect={() =>
                                handleSelect(
                                    direction,
                                )
                            }
                        />
                    ),
                )}
            </div>
        </section>
    );
}