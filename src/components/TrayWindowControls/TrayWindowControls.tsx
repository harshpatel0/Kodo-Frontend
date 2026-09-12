import { useState } from "react";
import {
  CaretUpIcon,
  CaretDownIcon,
  MinusIcon,
  PushPinIcon,
  PushPinSlashIcon,
  XIcon,
} from "@phosphor-icons/react";
import styles from "./TrayWindowControls.module.css";
import {
  closeTrayWindow,
  minimiseTrayWindow,
  toggleExpandTrayWindow,
  toggleTrayPin,
} from "../../utils/pywebview";

const ICON_SIZE = 28;

export default function TrayWindowControls() {
  const [expanded, setExpanded] = useState(false);
  const [pinned, setPinned] = useState(false);

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={`${styles.controlButton} ${pinned ? styles.pinnedButton : ""}`}
        aria-label={pinned ? "Unpin" : "Pin"}
        aria-pressed={pinned}
        onClick={() => {
          toggleTrayPin().then(setPinned);
        }}
      >
        {pinned ? (
          <PushPinIcon size={ICON_SIZE} weight="fill" />
        ) : (
          <PushPinSlashIcon size={ICON_SIZE} />
        )}
      </button>

      <button
        type="button"
        className={styles.controlButton}
        aria-label="Minimise"
        onClick={minimiseTrayWindow}
      >
        <MinusIcon size={ICON_SIZE} />
      </button>

      <button
        type="button"
        className={styles.controlButton}
        aria-label={expanded ? "Collapse" : "Expand"}
        onClick={() => {
          toggleExpandTrayWindow();
          setExpanded((prev) => !prev);
        }}
      >
        {expanded ? (
          <CaretUpIcon size={ICON_SIZE} />
        ) : (
          <CaretDownIcon size={ICON_SIZE} />
        )}
      </button>

      <button
        type="button"
        className={`${styles.controlButton} ${styles.closeButton}`}
        aria-label="Close"
        onClick={closeTrayWindow}
      >
        <XIcon size={ICON_SIZE} />
      </button>
    </div>
  );
}
