import styles from "./Heading.module.css";
import { useIsTrayApp } from "../../hooks/useIsTrayApp";
import TrayWindowControls from "../TrayWindowControls/TrayWindowControls";

type HeadingProperties = {
  heading?: string;
  subheading?: string;

  component?: React.ReactNode;
};

export default function Heading({
  heading,
  subheading,
  component,
}: HeadingProperties) {
  const isTrayApp = useIsTrayApp();

  const className = isTrayApp
    ? `${styles.locationHeading} ${styles.trayHeading}`
    : styles.locationHeading;

  const content = heading ? (
    <>
      <h1 className={styles.headingText}>{heading}</h1>
      <p className={styles.headingSubText}>{subheading}</p>
    </>
  ) : (
    component
  );

  return (
    <>
      <div style={styles} className={className}>
        {content}
      </div>
      {isTrayApp && (
        <div
          style={styles}
          className={`${className} ${styles.locationHeadingRight}`}
        >
          <TrayWindowControls />
        </div>
      )}
    </>
  );
}
