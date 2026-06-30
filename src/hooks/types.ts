export type LogEvent = {
  type: "log";
  level: string;
  module: string;
  message: string;
  ts: string;
};

export type StdoutEvent = {
  type: "stdout";
  level: string;
  message: string;
  ts: string;
};

export type ThinkingEvent = {
  type: "thinking";
  data: { text: string };
  ts: string;
};

export type ActionEvent<T = Record<string, unknown>> = {
  type: "action";
  data: T;
  ts: string;
};

export type HistoryEvent<T = unknown> = {
  type: "history";
  data: { entries: T[] };
  ts: string;
};

export type MetricsEvent<T = Record<string, unknown>> = {
  type: "metrics";
  data: T;
  ts: string;
};

export type PlannerPlanEvent<T = Record<string, unknown>> = {
  type: "planner_plan";
  data: T;
  ts: string;
};

export type StatusDoneEvent = {
  type: "status";
  status: "done";
};

export type StatusErrorEvent = {
  type: "status";
  status: "error";
  message: string;
};

export type StatusEvent = StatusDoneEvent | StatusErrorEvent;

export type TaskEvent =
  | LogEvent
  | StdoutEvent
  | ThinkingEvent
  | ActionEvent
  | HistoryEvent
  | MetricsEvent
  | PlannerPlanEvent
  | StatusEvent;

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";
