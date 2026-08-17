import Background from "../../components/Background/Background";
import Header from "../../components/Header/Header";
import Heading from "../../components/Heading/Heading";

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTaskRunner, useTaskStream } from "../../hooks/TaskContext";

import styles from "./Task.module.css";

import type { ConnectionStatus, TaskEvent } from "../../hooks/types";
import DesktopStreamImage from "../../components/DesktopStreamImage/DesktopStreamImage";
import {
  CaretDownIcon,
  ChecksIcon,
  LightningIcon,
} from "@phosphor-icons/react";

function formatTime(ts: string): string {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatParamValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean" || value == null) return String(value);
  return JSON.stringify(value);
}

type TimelineNode =
  | { ts: string; kind: "history"; text: string }
  | { ts: string; kind: "action"; name: string; params: [string, unknown][] };

function buildTimeline(events: TaskEvent[]): TimelineNode[] {
  const nodes: TimelineNode[] = [];
  for (const event of events) {
    if (event.type === "action") {
      nodes.push({
        ts: event.ts,
        kind: "action",
        name:
          typeof event.data.action === "string" ? event.data.action : "action",
        params: Object.entries(event.data).filter(
          ([key]) => key !== "action" && key !== "history",
        ),
      });
    } else if (event.type === "history") {
      for (const entry of event.data.entries) {
        nodes.push({ ts: event.ts, kind: "history", text: String(entry) });
      }
    }
  }
  return nodes;
}

function TimelineView() {
  const { events } = useTaskStream();
  const nodes = buildTimeline(events);

  if (nodes.length === 0) {
    return (
      <p className={styles.emptyState}>
        Kodo hasn't taken any actions yet. Sit tight.
      </p>
    );
  }

  return (
    <section>
      <h2 className={styles.sectionTitle}>Activity</h2>
      <ul className={styles.timeline}>
        {nodes.map((node, i) => (
          <li key={i} className={styles.timelineItem}>
            <span className={styles.timelineDot}>
              {node.kind === "history" ? (
                <ChecksIcon size={14} weight="bold" />
              ) : (
                <LightningIcon size={14} weight="fill" />
              )}
            </span>
            <span className={styles.timelineTime}>{formatTime(node.ts)}</span>
            {node.kind === "history" ? (
              <p className={styles.timelineContent}>{node.text}</p>
            ) : (
              <div className={styles.timelineContent}>
                <span className={styles.actionName}>{node.name}</span>
                {node.params.length > 0 && (
                  <div className={styles.actionParams}>
                    {node.params.map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {formatParamValue(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function ThinkingView() {
  const { thinking } = useTaskStream();
  if (!thinking) return null;
  return (
    <>
      <h2 className={styles.sectionTitle}>Thinking</h2>
      <p className={styles.thinking}>{thinking}</p>
    </>
  );
}

const METRIC_LABELS: Record<string, (value: number) => string> = {
  tokens_in: (n) => n.toLocaleString(),
  tokens_out: (n) => n.toLocaleString(),
  cache_read_tokens: (n) => n.toLocaleString(),
  cache_write_tokens: (n) => n.toLocaleString(),
  elapsed_ms: (n) => `${Math.round(n).toLocaleString()}ms`,
};

function MetricsView() {
  const { metrics } = useTaskStream();
  if (!metrics) return null;

  const data = metrics.data as Record<string, unknown>;
  const cards: { label: string; value: string }[] = [];

  const elapsedMs = typeof data.elapsed_ms === "number" ? data.elapsed_ms : 0;
  const tokens =
    (typeof data.tokens_in === "number" ? data.tokens_in : 0) +
    (typeof data.tokens_out === "number" ? data.tokens_out : 0);
  if (tokens > 0 && elapsedMs > 0) {
    cards.push({
      label: "Token Rate",
      value: `${Math.round(tokens / (elapsedMs / 1000)).toLocaleString()} tok/s`,
    });
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "number") {
      cards.push({
        label: key.replace(/_/g, " "),
        value: METRIC_LABELS[key]
          ? METRIC_LABELS[key](value)
          : value.toLocaleString(),
      });
    } else if (typeof value === "string") {
      cards.push({ label: key.replace(/_/g, " "), value });
    }
  }

  if (cards.length === 0) return null;

  return (
    <section className={styles.metricsSection}>
      <h2 className={styles.sectionTitle}>Metrics</h2>
      <div className={styles.metricsGrid}>
        {cards.map((card, i) => (
          <div key={i} className={styles.metricCard}>
            <div className={styles.metricValue}>{card.value}</div>
            <div className={styles.metricLabel}>{card.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Shelf() {
  const { logs } = useTaskStream();

  return (
    <section className={styles.shelf}>
      <details className={styles.shelfSection}>
        <summary className={styles.shelfSummary}>
          <span>Raw Logs ({logs.length})</span>
          <CaretDownIcon className={styles.shelfChevron} size={18} />
        </summary>
        <div className={styles.shelfBody}>
          {logs.length === 0 ? (
            <p className={styles.emptyState}>No logs yet.</p>
          ) : (
            <ul className={styles.logList}>
              {logs.map((log, i) => (
                <li key={i} className={styles.logLine}>
                  <span className={styles.timelineTime}>
                    {formatTime(log.ts)}
                  </span>{" "}
                  {log.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </details>

      <details className={styles.shelfSection}>
        <summary className={styles.shelfSummary}>
          <span>Desktop Feed</span>
          <CaretDownIcon className={styles.shelfChevron} size={18} />
        </summary>
        <div className={styles.shelfBody}>
          <DesktopStreamImage />
        </div>
      </details>
    </section>
  );
}

function TaskControls({
  disconnect,
  status,
  done,
  observing,
}: {
  disconnect: () => void;
  status: ConnectionStatus;
  done: boolean;
  observing: boolean;
}) {
  return (
    <div className={styles.controls}>
      {!observing && (
        <button
          className={styles.controlButton}
          disabled={status === "connected" || status === "connecting"}
        >
          Run
        </button>
      )}
      <button
        className={styles.controlButton}
        onClick={disconnect}
        disabled={status !== "connected" || observing}
      >
        Stop
      </button>
      <span className={styles.statusText}>
        Status: {status} {done && "Done"}
      </span>
    </div>
  );
}

export default function Task() {
  const { connect, disconnect, status, error, done, observing } =
    useTaskRunner();
  const { task } = useParams();
  const navigate = useNavigate();

  const isObserving = observing || !task;

  useEffect(() => {
    connect(task ?? "", undefined, isObserving);
  }, [task, connect, isObserving]);

  useEffect(() => {
    if (
      isObserving &&
      !done &&
      status === "error" &&
      !error?.includes("already running")
    ) {
      navigate("/");
    } else if (
      !isObserving &&
      status === "error" &&
      error?.includes("already running")
    ) {
      navigate("/task");
    }
  }, [isObserving, done, status, error, navigate]);

  return (
    <>
      <Background />
      <Heading component={<Header />} />
      <main className={styles.main}>
        {isObserving && status === "connected" && (
          <div className={styles.observeBanner}>A task is already running.</div>
        )}

        {status === "error" && error && !error.includes("already running") && (
          <div className={styles.warning} role="alert">
            <strong>Can't connect to the Kodo API.</strong> Is the backend
            running?
          </div>
        )}

        <section className={styles.statusBar}>
          <h2 className={styles.taskTitle}>{task ?? "Running task"}</h2>
          <TaskControls
            disconnect={disconnect}
            status={status}
            done={done}
            observing={isObserving}
          />
        </section>

        <ThinkingView />
        <TimelineView />
        <MetricsView />
        <Shelf />
      </main>
    </>
  );
}
