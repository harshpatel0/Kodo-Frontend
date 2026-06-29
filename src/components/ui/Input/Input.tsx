import cx from "classnames";
import styles from "./Input.module.css";

type InputProperties = {
  label?: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number" | "date" | "tel";
  useTranslucentBackground?: boolean;
  className?: string;
};

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  useTranslucentBackground = false,
  className,
}: InputProperties) {
  return (
    <div className={styles.group}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={cx(styles.field, {
          [styles.transparent]: useTranslucentBackground,
          className,
        })}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
