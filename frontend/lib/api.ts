import type {
    BrandState,
    DataRecord,
    Project,
    ProjectExport,
    StageId,
    WorkflowInput,
    WorkflowRun,
} from "./types";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
    "http://127.0.0.1:8000/api";

const REQUEST_TIMEOUT_MS = 60_000;

export class ApiError extends Error {
    status: number;
    details: unknown;

    constructor(
        message: string,
        status = 0,
        details: unknown = null,
    ) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function parseResponseBody(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function getErrorMessage(
    status: number,
    body: unknown,
): string {
    if (typeof body === "string" && body.trim()) {
        return body;
    }

    if (isRecord(body)) {
        const detail = body.detail;

        if (typeof detail === "string" && detail.trim()) {
            return detail;
        }

        if (Array.isArray(detail)) {
            const messages = detail
                .map((item) => {
                    if (isRecord(item) && typeof item.msg === "string") {
                        return item.msg;
                    }

                    return null;
                })
                .filter((item): item is string => Boolean(item));

            if (messages.length > 0) {
                return messages.join(", ");
            }
        }

        if (typeof body.message === "string" && body.message.trim()) {
            return body.message;
        }
    }

    return `Request failed with status ${status}.`;
}

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const controller = new AbortController();
    const timeout = window.setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
    );

    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            signal: controller.signal,
            headers: {
                Accept: "application/json",
                ...(options.body ? { "Content-Type": "application/json" } : {}),
                ...options.headers,
            },
        });

        const body = await parseResponseBody(response);

        if (!response.ok) {
            throw new ApiError(
                getErrorMessage(response.status, body),
                response.status,
                body,
            );
        }

        return body as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof DOMException && error.name === "AbortError") {
            throw new ApiError(
                "The request timed out. Make sure the backend is running and try again.",
            );
        }

        if (error instanceof TypeError) {
            throw new ApiError(
                "Could not connect to the Brand Intelligence backend.",
            );
        }

        throw error;
    } finally {
        window.clearTimeout(timeout);
    }
}

function assertProject(value: unknown): Project {
    if (!isRecord(value)) {
        throw new ApiError("Backend returned an invalid project response.");
    }

    return {
        id: String(value.id ?? ""),
        name: String(value.name ?? ""),
        idea: String(value.idea ?? ""),
        status: String(value.status ?? ""),
        created_at: String(value.created_at ?? ""),
        updated_at: String(value.updated_at ?? ""),
    };
}

function assertWorkflowRun(value: unknown): WorkflowRun {
    if (!isRecord(value)) {
        throw new ApiError("Backend returned an invalid workflow response.");
    }

    return {
        id: String(value.id ?? ""),
        project_id: String(value.project_id ?? ""),
        stage: String(value.stage ?? "") as StageId,
        status: String(value.status ?? "pending") as WorkflowRun["status"],
        input_data: isRecord(value.input_data)
            ? value.input_data
            : null,
        output_data: isRecord(value.output_data)
            ? value.output_data
            : null,
        error_message:
            typeof value.error_message === "string"
                ? value.error_message
                : null,
        started_at:
            typeof value.started_at === "string"
                ? value.started_at
                : null,
        completed_at:
            typeof value.completed_at === "string"
                ? value.completed_at
                : null,
        created_at: String(value.created_at ?? ""),
    };
}

function assertBrandState(value: unknown): BrandState {
    if (!isRecord(value)) {
        throw new ApiError("Backend returned an invalid brand-state response.");
    }

    return {
        id: String(value.id ?? ""),
        project_id: String(value.project_id ?? ""),
        version: Number(value.version ?? 1),
        data: isRecord(value.data) ? value.data : {},
        updated_at: String(value.updated_at ?? ""),
    };
}

function assertProjectExport(value: unknown): ProjectExport {
    if (!isRecord(value)) {
        throw new ApiError("Backend returned an invalid export response.");
    }

    const project = assertProject(value.project);

    const brand =
        value.brand === null || value.brand === undefined
            ? null
            : assertBrandState(value.brand);

    const workflowHistory = Array.isArray(value.workflow_history)
        ? value.workflow_history.map(assertWorkflowRun)
        : [];

    return {
        project,
        brand,
        workflow_history: workflowHistory,
    };
}

export interface CreateProjectInput {
    name: string;
    idea: string;
}

export interface WorkflowResultInput {
    status: "completed" | "failed";
    output_data?: DataRecord | null;
    error_message?: string | null;
}

export const api = {
    async createProject(
        input: CreateProjectInput,
    ): Promise<Project> {
        const response = await request<unknown>("/projects", {
            method: "POST",
            body: JSON.stringify({
                name: input.name,
                idea: input.idea,
            }),
        });

        return assertProject(response);
    },

    async getProject(
        projectId: string,
    ): Promise<Project> {
        const response = await request<unknown>(
            `/projects/${encodeURIComponent(projectId)}`,
        );

        return assertProject(response);
    },

    async getRuns(
        projectId: string,
    ): Promise<WorkflowRun[]> {
        const response = await request<unknown>(
            `/projects/${encodeURIComponent(projectId)}/workflow`,
        );

        if (!Array.isArray(response)) {
            throw new ApiError(
                "Backend returned an invalid workflow history response.",
            );
        }

        return response.map(assertWorkflowRun);
    },

    async getBrand(
        projectId: string,
    ): Promise<BrandState | null> {
        try {
            const response = await request<unknown>(
                `/projects/${encodeURIComponent(projectId)}/brand`,
            );

            return assertBrandState(response);
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                return null;
            }

            throw error;
        }
    },

    async startWorkflow(
        projectId: string,
        stage: StageId,
        inputData: WorkflowInput,
    ): Promise<WorkflowRun> {
        const response = await request<unknown>(
            `/projects/${encodeURIComponent(projectId)}/workflow/run`,
            {
                method: "POST",
                body: JSON.stringify({
                    stage,
                    input_data: inputData,
                }),
            },
        );

        return assertWorkflowRun(response);
    },

    async saveWorkflowResult(
        projectId: string,
        runId: string,
        result: WorkflowResultInput,
    ): Promise<WorkflowRun> {
        const response = await request<unknown>(
            `/projects/${encodeURIComponent(projectId)}/workflow/${encodeURIComponent(runId)}/result`,
            {
                method: "POST",
                body: JSON.stringify({
                    status: result.status,
                    output_data: result.output_data ?? null,
                    error_message: result.error_message ?? null,
                }),
            },
        );

        return assertWorkflowRun(response);
    },

    async updateBrand(
        projectId: string,
        data: DataRecord,
    ): Promise<BrandState> {
        const response = await request<unknown>(
            `/projects/${encodeURIComponent(projectId)}/brand`,
            {
                method: "PUT",
                body: JSON.stringify({
                    data,
                }),
            },
        );

        return assertBrandState(response);
    },

    async exportProject(
        projectId: string,
    ): Promise<ProjectExport> {
        const response = await request<unknown>(
            `/projects/${encodeURIComponent(projectId)}/export`,
        );

        return assertProjectExport(response);
    },
};

export function getApiBaseUrl(): string {
    return API_BASE_URL;
}