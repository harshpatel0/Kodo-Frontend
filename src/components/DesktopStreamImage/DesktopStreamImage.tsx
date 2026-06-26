import styles from "./DesktopStreamImage.module.css";
import { KODO_BASE_URL } from "../../utils/globals";

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
          ? KODO_BASE_URL + "/bg-desktop-feed"
          : KODO_BASE_URL + "/desktop-feed"
      }
    ></img>
  );
}
