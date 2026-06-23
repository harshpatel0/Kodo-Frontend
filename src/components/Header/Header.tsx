import Button from "../ui/Button/Button";
import styles from "./Header.module.css";
import SplitText from "../SplitText/SplitText";

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <header className={styles.headerRoot}>
        <div className={styles.headerBranding}>
          <h1>
            <SplitText text="Kodo" className={styles.brandingLetter} />
          </h1>
        </div>

        <div>
          <Button type="blurred">Home</Button>
          <Button type="blurred">Settings</Button>
        </div>

        <div></div>
      </header>
    </div>
  );
}
