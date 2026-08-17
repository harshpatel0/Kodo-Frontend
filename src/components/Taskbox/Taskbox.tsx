import styles from "./Taskbox.module.css";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";

import { CursorClickIcon, CursorIcon } from "@phosphor-icons/react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

type TaskBoxProperties = {
  taskValue: string;
  setTaskValue: (newTaskValue: string) => void;
  buttonDisabled: boolean;
};

export default function TaskBox({
  taskValue,
  setTaskValue,
  buttonDisabled,
}: TaskBoxProperties) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <form
      className={styles.taskBox}
      onSubmit={(event) => {
        event.preventDefault();
        const value = taskValue.trim();
        if (value) {
          navigate(`/task/${value}`);
        }
      }}
    >
      <Input
        type="text"
        value={taskValue}
        onChange={setTaskValue}
        useTranslucentBackground={true}
        className={styles.taskBoxInput}
      />
      <Button
        type="blurred"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ padding: "9px 16px" }}
        disabled={buttonDisabled}
        to={taskValue.trim() ? `/task/${taskValue.trim()}` : undefined}
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
    </form>
  );
}
