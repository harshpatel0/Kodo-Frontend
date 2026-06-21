import styles from "./Button.module.css";
import cx from "classnames";
import { Link } from "react-router-dom";

type ButtonProperties = {
  type: "primary" | "secondary" | "accent";
  disabled: boolean;
  text: React.ReactNode;

  to?: string;
  state?: { [key: string]: string };

  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button({
  text,
  to,
  type = "primary",
  disabled = false,
  state = {},
  onClick = () => {},
}: ButtonProperties) {
  const buttonStyles = cx(styles.button, styles[`button-${type}`], {
    [styles.disabled]: disabled,
  });

  if (to) {
    return (
      <Link to={to} state={state} className={buttonStyles}>
        {text}
      </Link>
    );
  }

  return (
    <button
      className={buttonStyles}
      disabled={disabled}
      onClick={(e) => onClick?.(e)}
    >
      {text}
    </button>
  );
}
