import styles from "./DesktopStreamImage.module.css";

export default function DesktopStreamImage({
  useBackgroundFeed = false,
}: {
  useBackgroundFeed?: boolean;
}) {
  return (
    <img
      className={styles.desktopStreamImage}
      src={
        useBackgroundFeed
          ? "http://localhost:8000/bg-desktop-feed"
          : "http://localhost:8000/desktop-feed"
      }
    ></img>
  );
}
