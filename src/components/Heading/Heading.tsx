import styles from "./Heading.module.css";

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
  if (heading) {
    return (
      <div style={styles} className={styles.locationHeading}>
        <h1 className={styles.headingText}>{heading}</h1>
        <p className={styles.headingSubText}>{subheading}</p>
      </div>
    );
  } else {
    return (
      <div style={styles} className={styles.locationHeading}>
        {component}
      </div>
    );
  }
}
