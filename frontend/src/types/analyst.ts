export interface AnalystResult {
  sql_used: string;
  conclusion: string;
}

export interface ToolTraceEntry {
  step_type: string;
  tool_name: string;
  message: string;
  tool_call_id?: string | null;
  arguments?: Record<string, unknown> | null;
  result_preview?: string | null;
}

export interface AnalystQueryResponse {
  question: string;
  result: AnalystResult;
  tool_trace: ToolTraceEntry[];
}
