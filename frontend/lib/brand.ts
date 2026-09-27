import type {
    DataRecord,
    SelectionKind,
    StageDefinition,
    StageId,
    WorkflowRun,
} from "./types";

export const STAGES: StageDefinition[] = [
    {
        id: "discovery",
        route: "discovery",
        number: "01",
        label: "Discover",
        eyebrow: "Understand",
        title: "Discover the opportunity",
        description:
            "Clarify the problem, audience, context, and opportunity behind the idea.",
        principle:
            "Start with the problem, not the brand.",
        fields: [
            "Problem",
            "Audience",
            "Context",
            "Opportunity",
            "Constraints",
        ],
    },
    {
        id: "positioning",
        route: "positioning",
        number: "02",
        label: "Position",
        eyebrow: "Decide",
        title: "Choose a strategic direction",
        description:
            "Explore meaningful positioning directions and select the one that best fits the opportunity.",
        principle:
            "Make the strategic choice explicit.",
        fields: [
            "Market",
            "Audience",
            "Differentiation",
            "Value proposition",
            "Positioning directions",
        ],
    },
    {
        id: "shape",
        route: "shape",
        number: "03",
        label: "Shape",
        eyebrow: "Express",
        title: "Shape the brand",
        description:
            "Turn the chosen strategic direction into personality, naming, and a distinctive voice.",
        principle:
            "Give the strategy a recognizable character.",
        fields: [
            "Personality",
            "Naming",
            "Voice",
            "Messaging",
            "Brand traits",
        ],
    },
    {
        id: "visualize",
        route: "visualize",
        number: "04",
        label: "Visualize",
        eyebrow: "Design",
        title: "Build the visual identity",
        description:
            "Translate the brand strategy into a coherent visual identity system.",
        principle:
            "Make the visual system reinforce the strategy.",
        fields: [
            "Color",
            "Typography",
            "Visual direction",
            "Imagery",
            "Design principles",
        ],
    },
    {
        id: "challenge",
        route: "challenge",
        number: "05",
        label: "Challenge",
        eyebrow: "Stress-test",
        title: "Challenge the brand",
        description:
            "Review the emerging identity for contradictions, gaps, and inconsistencies.",
        principle:
            "Find weaknesses before launch.",
        fields: [
            "Issues",
            "Consistency",
            "Risks",
            "Recommendations",
            "Open decisions",
        ],
    },
    {
        id: "deliver",
        route: "brand-kit",
        number: "06",
        label: "Deliver",
        eyebrow: "Launch",
        title: "Assemble the brand kit",
        description:
            "Bring the strategic and creative decisions together into a launch-ready brand system.",
        principle:
            "Turn connected decisions into a usable system.",
        fields: [
            "Brand strategy",
            "Brand voice",
            "Visual identity",
            "Launch assets",
            "Brand summary",
        ],
    },
];

export function isRecord(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

export function hasContent(value: unknown): boolean {
    if (value === null || value === undefined) {
        return false;
    }

    if (typeof value === "string") {
        return value.trim().length > 0;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.some(hasContent);
    }

    if (isRecord(value)) {
        return Object.values(value).some(hasContent);
    }

    return false;
}

export function readableLabel(value: string): string {
    return value
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) =>
            character.toUpperCase(),
        );
}

export function stageUrl(
    projectId: string,
    stage: StageId,
): string {
    const definition = STAGES.find(
        (item) => item.id === stage,
    );

    const route = definition?.route ?? stage;

    return `/project/${encodeURIComponent(
        projectId,
    )}/${route}`;
}

export function stageForPath(
    pathname: string,
): StageId | null {
    const normalizedPath = pathname.replace(
        /\/+$/,
        "",
    );

    for (const stage of STAGES) {
        if (
            normalizedPath.endsWith(
                `/${stage.route}`,
            ) ||
            normalizedPath.endsWith(
                `/${stage.id}`,
            )
        ) {
            return stage.id;
        }
    }

    return null;
}

export function sortRuns(
    runs: WorkflowRun[],
): WorkflowRun[] {
    return [...runs].sort(
        (first, second) =>
            new Date(second.created_at).getTime() -
            new Date(first.created_at).getTime(),
    );
}

export function latestRun(
    runs: WorkflowRun[],
    stage: StageId,
): WorkflowRun | null {
    const matchingRuns = sortRuns(runs).filter(
        (run) => run.stage === stage,
    );

    return matchingRuns[0] ?? null;
}

export function isActiveRun(
    run: WorkflowRun | null | undefined,
): boolean {
    return (
        run?.status === "pending" ||
        run?.status === "running"
    );
}

export function completedStageIds(
    runs: WorkflowRun[],
): StageId[] {
    const completed = new Set<StageId>();

    for (const run of runs) {
        if (run.status === "completed") {
            completed.add(run.stage);
        }
    }

    return STAGES.map(
        (stage) => stage.id,
    ).filter((stage) => completed.has(stage));
}

export function getStageData(
    brandData: DataRecord | null | undefined,
    stage: StageId,
): unknown {
    if (!brandData) {
        return null;
    }

    const stages = brandData.stages;

    if (!isRecord(stages)) {
        return null;
    }

    return stages[stage] ?? null;
}

export function buildStageInput(
    idea: string,
    brandData: DataRecord | null | undefined,
    selections: Partial<
        Record<
            SelectionKind,
            {
                label: string;
                value: unknown;
            }
        >
    >,
    instructions: string,
) {
    return {
        idea,
        brand_context: brandData ?? {},
        selections,
        instructions,
    };
}

export function selectionLabel(
    selection:
        | {
            label: string;
            value: unknown;
        }
        | null
        | undefined,
): string {
    return selection?.label ?? "";
}

export function sameValue(
    first: unknown,
    second: unknown,
): boolean {
    try {
        return JSON.stringify(first) === JSON.stringify(second);
    } catch {
        return first === second;
    }
}

export function toPlainText(
    value: unknown,
): string {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    if (
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return String(value);
    }

    if (Array.isArray(value)) {
        return value
            .map(toPlainText)
            .filter(Boolean)
            .join("\n");
    }

    if (isRecord(value)) {
        return Object.entries(value)
            .map(([key, entry]) => {
                const text = toPlainText(entry);

                return text
                    ? `${readableLabel(key)}: ${text}`
                    : "";
            })
            .filter(Boolean)
            .join("\n");
    }

    return "";
}