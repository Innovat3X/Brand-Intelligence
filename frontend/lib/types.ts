export type StageId =
  | "discovery"
  | "positioning"
  | "shape"
  | "visualize"
  | "challenge"
  | "deliver";

export type DataRecord = Record<string, unknown>;

export interface Project {
  id: string;
  name: string;
  idea: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type RunStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface WorkflowRun {
  id: string;
  project_id: string;
  stage: StageId;
  status: RunStatus;
  input_data: DataRecord | null;
  output_data: DataRecord | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface BrandState {
  id: string;
  project_id: string;
  version: number;
  data: DataRecord;
  updated_at: string;
}

export interface StageDefinition {
  id: StageId;
  route: string;
  number: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  principle: string;
  fields: string[];
}

export type SelectionKind = "direction" | "name";

export interface BrandSelection {
  label: string;
  value: unknown;
}

export type BrandSelections = Partial<
  Record<SelectionKind, BrandSelection>
>;

export interface WorkflowInput {
  idea: string;
  brand_context: DataRecord;
  selections: BrandSelections;
  instructions: string;
}

export interface ProjectExport {
  project: Project;
  brand: BrandState | null;
  workflow_history: WorkflowRun[];
}