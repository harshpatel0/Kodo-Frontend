import Background from "../../components/Background/Background";
import Header from "../../components/Header/Header";
import Heading from "../../components/Heading/Heading";

import styles from "./Home.module.css";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplitText from "../../components/SplitText/SplitText";
import TaskBox from "../../components/Taskbox/Taskbox";
import { getTaskRunningStatus, KODO_BASE_URL } from "../../utils/globals";

export default function Home() {
  const [taskValue, setTaskValue] = useState("");
  const [disableButton] = useState(false);
  const [checking, setChecking] = useState(true);
  const [apiWarning, setApiWarning] = useState(false);
  const navigate = useNavigate();

  const runCheck = useCallback(() => {
    getTaskRunningStatus()
      .then(({ running }) => {
        if (running) {
          navigate("/task");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        setApiWarning(true);
        setChecking(false);
      });
  }, [navigate]);

  useEffect(() => {
    runCheck();
  }, [runCheck]);

  const retry = () => {
    setChecking(true);
    setApiWarning(false);
    runCheck();
  };

  if (checking) {
    return (
      <>
        <Background />
        <Heading component={<Header />} />
        <main className={styles.mainContent}>
          <p>Checking for a running task…</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Background />
      <Heading component={<Header />} />

      {apiWarning && (
        <div className={styles.warning} role="alert">
          <strong>Can't reach the Kodo API</strong> at {KODO_BASE_URL}. Is the
          backend running?
          <button className={styles.warningRetry} onClick={retry}>
            Retry
          </button>
        </div>
      )}

      <main className={styles.mainContent}>
        <div>
          <SplitText
            style={{ fontSize: "1.5rem" }}
            text="Ask Kodo something to do on your behalf"
          />
          <TaskBox
            taskValue={taskValue}
            setTaskValue={setTaskValue}
            buttonDisabled={disableButton}
          />
        </div>
      </main>
    </>
  );
}
