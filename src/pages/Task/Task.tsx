import Background from "../../components/Background/Background";
import Header from "../../components/Header/Header";
import Heading from "../../components/Heading/Heading";

import { useEffect } from "react";
import { useTaskRunner, useTaskStream } from "../../hooks/TaskContext";
import { useParams } from "react-router-dom";

import styles from "./Task.module.css";

import type { ConnectionStatus } from "../../hooks/types";
import DesktopStreamImage from "../../components/DesktopStreamImage/DesktopStreamImage";

function TaskControls({
  disconnect,
  status,
  done,
}: {
  disconnect: () => void;
  status: ConnectionStatus;
  done: boolean;
}) {
  return (
    <section>
      <button disabled={status === "connected" || status === "connecting"}>
        Run
      </button>
      <button onClick={disconnect} disabled={status !== "connected"}>
        Stop
      </button>
      <p>
        Status: {status} {done && "✓ Done"}
      </p>
    </section>
  );
}

function ThinkingView() {
  const { thinking } = useTaskStream();

  if (!thinking) return null;

  return (
    <section>
      <h3>Thinking</h3>
      <p>{thinking}</p>
    </section>
  );
}

function LogsView() {
  const { logs } = useTaskStream();

  if (logs.length === 0) return null;

  return (
    <section>
      <h3>Logs ({logs.length})</h3>
      <ul
        style={{
          maxHeight: "200px",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "0.8rem",
        }}
      >
        {logs.map((log, i) => (
          <li key={i}>{log.message}</li>
        ))}
      </ul>
    </section>
  );
}

function MetricsView() {
  const { action, metrics, plan } = useTaskStream();

  return (
    <section>
      {action && (
        <>
          <h3>Latest Action</h3>
          <pre>{JSON.stringify(action.data, null, 2)}</pre>
        </>
      )}
      {metrics && (
        <>
          <h3>Metrics</h3>
          <pre>{JSON.stringify(metrics.data, null, 2)}</pre>
        </>
      )}
      {plan && (
        <>
          <h3>Plan</h3>
          <pre>{JSON.stringify(plan.data, null, 2)}</pre>
        </>
      )}
    </section>
  );
}

export default function Task() {
  const { connect, disconnect, status, done } = useTaskRunner();
  const { task } = useParams();
  useEffect(() => {
    if (task) {
      connect(task);
    }
    return () => disconnect();
  }, [task, connect, disconnect]);

  return (
    <>
      <Background />
      <Heading component={<Header />} />
      <main className={styles.main}>
        <section className={styles.gridContainer}>
          <section>
            <TaskControls disconnect={disconnect} status={status} done={done} />
            <ThinkingView />
            <MetricsView />
          </section>
          <section>
            <LogsView />
            <br />
            <DesktopStreamImage />
          </section>
        </section>
      </main>
    </>
  );
}
