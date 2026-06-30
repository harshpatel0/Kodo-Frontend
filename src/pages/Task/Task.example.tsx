import Background from "../../components/Background/Background";
import Header from "../../components/Header/Header";
import Heading from "../../components/Heading/Heading";
import { useTaskRunner, useTaskStream } from "../../hooks/TaskContext";
import { useState } from "react";

function TaskControls() {
  const { connect, disconnect, status, done } = useTaskRunner();
  const [taskInput, setTaskInput] = useState("open notepad");

  return (
    <section>
      <input
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Enter a task..."
      />
      <button
        onClick={() => connect(taskInput)}
        disabled={status === "connected" || status === "connecting"}
      >
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
  return (
    <>
      <Background />
      <Heading component={<Header />} />
      <main style={{ padding: "2rem", color: "white" }}>
        <TaskControls />
        <ThinkingView />
        <MetricsView />
        <LogsView />
      </main>
    </>
  );
}
