import styles from "./Button.module.css";
import cx from "classnames";
import React from "react";
import { Link } from "react-router-dom";

type BaseProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "type">;

type ButtonProperties = BaseProps & {
  type?: "primary" | "secondary" | "accent" | "danger" | "disabled" | "blurred";
  to?: string;
  state?: { [key: string]: string };
};

export default function Button({
  to,
  type,
  disabled = false,
  state = {},
  onClick = () => {},
  style,
  children,
  ...rest
}: ButtonProperties) {
  const buttonStyles = cx(styles.button, styles[`button-${type}`], {
    [styles.disabled]: disabled,
  });

  if (to) {
    return (
      <Link
        to={to}
        state={state}
        style={style}
        className={buttonStyles}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonStyles}
      disabled={disabled}
      onClick={(e) => onClick?.(e)}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}
