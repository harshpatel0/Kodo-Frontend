import React from "react";
import styles from "./SplitText.module.css";

export default function SplitText({
  text,
  className = styles.splitText,
  style, // This is your custom style prop
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={className}
          style={
            {
              ...style, // Spread the incoming custom styles here
              "--delay": `${index * 0.05}s`,
            } as React.CSSProperties
          }
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}
