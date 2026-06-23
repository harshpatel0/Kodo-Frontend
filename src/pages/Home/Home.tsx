import Background from "../../components/Background/Background";
import Header from "../../components/Header/Header";
import Heading from "../../components/Heading/Heading";
import Button from "../../components/ui/Button/Button";
import Input from "../../components/ui/Input/Input";
import { CursorClickIcon, CursorIcon } from "@phosphor-icons/react";

import styles from "./Home.module.css";

import { useState } from "react";
import SplitText from "../../components/SplitText/SplitText";

export default function Home() {
  const [value, setValue] = useState("");

  const [isHovered, setIsHovered] = useState(false);

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
          <div className={styles.taskBox}>
            <Input
              type="text"
              value={value}
              onChange={setValue}
              useTranslucentBackground={true}
              className={styles.taskBoxInput}
            />
            <Button
              type="blurred"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ padding: "9px 16px" }}
            >
              {isHovered ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <CursorClickIcon weight="bold" size={32} />
                  <span>Go</span>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <CursorIcon weight="bold" size={32} />
                  <span>Go</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
