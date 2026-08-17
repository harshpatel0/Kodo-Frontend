import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { KODO_BASE_URL } from "../utils/globals";
import type {
  TaskEvent,
  ConnectionStatus,
  LogEvent,
  StdoutEvent,
  ActionEvent,
  HistoryEvent,
  MetricsEvent,
  PlannerPlanEvent,
} from "./types";

export interface TaskStreamTypes {
  action: Record<string, unknown>;
  metrics: Record<string, unknown>;
  plan: Record<string, unknown>;
  history: unknown;
}

interface TaskContextValue<T extends TaskStreamTypes = TaskStreamTypes> {
  events: TaskEvent[];
  logs: (LogEvent | StdoutEvent)[];
  thinking: string;
  action: ActionEvent<T["action"]> | null;
  history: HistoryEvent<T["history"]> | null;
  metrics: MetricsEvent<T["metrics"]> | null;
  plan: PlannerPlanEvent<T["plan"]> | null;
  status: ConnectionStatus;
  error: string | null;
  done: boolean;
  observing: boolean;
  connect: (
    task: string,
    modeOverride?: "planner-actor" | "autonomy",
    observe?: boolean,
  ) => void;
  disconnect: () => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

type ProviderTypes = TaskStreamTypes;

export function TaskProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<TaskEvent[]>([]);
  const [logs, setLogs] = useState<(LogEvent | StdoutEvent)[]>([]);
  const [thinking, setThinking] = useState("");
  const [action, setAction] = useState<ActionEvent | null>(null);
  const [history, setHistory] = useState<HistoryEvent | null>(null);
  const [metrics, setMetrics] = useState<MetricsEvent | null>(null);
  const [plan, setPlan] = useState<PlannerPlanEvent | null>(null);
  const [done, setDone] = useState(false);
  const [observing, setObserving] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const erroredRef = useRef(false);
  const runKeyRef = useRef("");

  const disconnect = useCallback(() => {
    runKeyRef.current = "";
    wsRef.current?.close();
    wsRef.current = null;
    setStatus("disconnected");
    setObserving(false);
  }, []);

  const connect = useCallback(
    (
      task: string,
      modeOverride?: "planner-actor" | "autonomy",
      observe?: boolean,
    ) => {
      if (!task && !observe) return;

      const key = observe ? "observe" : `task:${task}`;
      const ws = wsRef.current;
      const alive =
        ws &&
        (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING);

      // Already live for this exact run, or observing while a starter is open?
      // Don't tear it down — just resync the mode flag.
      if (alive && (runKeyRef.current === key || observe)) {
        setObserving(!!observe);
        return;
      }

      // Switching to a different task: close the old connection (stops that run).
      if (alive) {
        ws.close();
        wsRef.current = null;
      }

      runKeyRef.current = key;

      const params = new URLSearchParams();
      if (task) {
        params.set("task", task);
      }
      if (modeOverride) {
        params.set("mode_override", modeOverride);
      }
      if (observe) {
        params.set("observe", "true");
      }

      const wsUrl = KODO_BASE_URL.replace(/^http/, "ws") + `/run/?${params}`;
      const newWs = new WebSocket(wsUrl);
      wsRef.current = newWs;
      erroredRef.current = false;
      setStatus("connecting");
      setError(null);
      setDone(false);
      setObserving(!!observe);
      setEvents([]);
      setLogs([]);
      setThinking("");
      setAction(null);
      setHistory(null);
      setMetrics(null);
      setPlan(null);

      newWs.onopen = () => {
        if (wsRef.current !== newWs) {
          newWs.close();
          return;
        }
        setStatus("connected");
      };

      newWs.onmessage = (event) => {
        if (wsRef.current !== newWs) return;

        try {
          const parsed: TaskEvent = JSON.parse(event.data);
          setEvents((prev) => [...prev, parsed]);

          switch (parsed.type) {
            case "log":
            case "stdout":
              setLogs((prev) => [...prev, parsed]);
              break;
            case "thinking":
              setThinking(parsed.data.text);
              break;
            case "action":
              setAction(parsed);
              break;
            case "history":
              setHistory(parsed);
              break;
            case "metrics":
              setMetrics(parsed);
              break;
            case "planner_plan":
              setPlan(parsed);
              break;
            case "status":
              if (parsed.status === "done" || parsed.status === "error") {
                newWs.close();
                wsRef.current = null;
                runKeyRef.current = "";
                setStatus("disconnected");
                setDone(true);
                if (parsed.status === "error") {
                  setError(parsed.message);
                }
              }
              break;
          }
        } catch {
          // Ignore malformed messages
        }
      };

      newWs.onerror = () => {
        if (wsRef.current !== newWs) return;
        erroredRef.current = true;
        setStatus("error");
        setError("WebSocket connection error");
      };

      newWs.onclose = (event) => {
        if (wsRef.current !== newWs) return;
        wsRef.current = null;
        runKeyRef.current = "";
        if (erroredRef.current) {
          erroredRef.current = false;
          setError(event.reason || "WebSocket connection error");
          return;
        }
        setStatus("disconnected");
      };
    },
    []
  );

  return (
    <TaskContext.Provider
      value={{
        events,
        logs,
        thinking,
        action: action as ActionEvent<ProviderTypes["action"]> | null,
        history: history as HistoryEvent<ProviderTypes["history"]> | null,
        metrics: metrics as MetricsEvent<ProviderTypes["metrics"]> | null,
        plan: plan as PlannerPlanEvent<ProviderTypes["plan"]> | null,
        status,
        error,
        done,
        observing,
        connect,
        disconnect,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

function useTaskContext<T extends TaskStreamTypes = TaskStreamTypes>(): TaskContextValue<T> {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error("useTaskContext must be used inside <TaskProvider>");
  }
  return ctx as TaskContextValue<T>;
}

export function useTaskRunner() {
  const { connect, disconnect, status, error, done, observing } =
    useTaskContext();
  return { connect, disconnect, status, error, done, observing };
}

export function useTaskStream<T extends TaskStreamTypes = TaskStreamTypes>() {
  const { events, logs, thinking, action, history, metrics, plan } =
    useTaskContext<T>();
  return { events, logs, thinking, action, history, metrics, plan };
}
