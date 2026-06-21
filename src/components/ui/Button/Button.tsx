import styles from "./Button.module.css";
import cx from "classnames";
import { Link } from "react-router-dom";

type ButtonProperties = {
  type: "primary" | "secondary" | "accent";
  disabled: boolean;
  text: React.ReactNode;

  to: string;
  state: { [key: string]: string };

  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Button(props: ButtonProperties) {
  const buttonStyles = cx(styles.button, styles[`button-${props.type}`], {
    [styles.disabled]: props.disabled,
  });

  if (props.to) {
    return (
      <Link to={props.to} state={props.state} className={buttonStyles}>
        {props.text}
      </Link>
    );
  }

  return (
    <button
      className={buttonStyles}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}
