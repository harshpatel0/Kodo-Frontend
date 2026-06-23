import styles from "./Background.module.css";
import DesktopStreamImage from "../DesktopStreamImage/DesktopStreamImage";

export default function Background() {
  return (
    <div className={styles.backgroundElement}>
      <div className={styles.backgroundDesktopStream}>
        <DesktopStreamImage />
      </div>

      <div className={styles.backgroundBlurOverlay}></div>
    </div>
  );
}
