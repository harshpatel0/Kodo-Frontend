import styles from "./DesktopStreamImage.module.css";

export default function DesktopStreamImage() {
  return (
    <img
      className={styles.desktopStreamImage}
      src="http://localhost:8000/bg-desktop-feed"
    ></img>
  );
}
