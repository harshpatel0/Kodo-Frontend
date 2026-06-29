import Background from "../../components/Background/Background";
import Header from "../../components/Header/Header";
import Heading from "../../components/Heading/Heading";

import styles from "./Home.module.css";

import { useState } from "react";
import SplitText from "../../components/SplitText/SplitText";
import TaskBox from "../../components/Taskbox/Taskbox";

export default function Home() {
  const [taskValue, setTaskValue] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [disableButton, _] = useState(false);

  return (
    <>
      <Background />
      <Heading component={<Header />} />

      <main className={styles.mainContent}>
        <div>
          <SplitText
            style={{ fontSize: "1.5rem" }}
            text="Ask Kodo something to do on your behalf"
          />
          <TaskBox
            taskValue={taskValue}
            setTaskValue={setTaskValue}
            isButtonClicked={isButtonClicked}
            onButtonClick={setIsButtonClicked}
            buttonDisabled={disableButton}
          />
        </div>
      </main>
    </>
  );
}
