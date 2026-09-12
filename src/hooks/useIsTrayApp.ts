import { useEffect, useState } from "react";
import { isTrayApp } from "../utils/globals";

// The tray host (pywebview) injects the localStorage flag on its "loaded"
// event, which can fire after React has already mounted and done its first
// read. Poll briefly so a flag that arrives a beat late still gets picked up.
const POLL_INTERVAL_MS = 50;
const POLL_TIMEOUT_MS = 3000;

export function useIsTrayApp(): boolean {
  const [isTray, setIsTray] = useState(isTrayApp);

  useEffect(() => {
    if (isTray) return;

    const start = Date.now();
    const interval = setInterval(() => {
      if (isTrayApp()) {
        setIsTray(true);
        clearInterval(interval);
      } else if (Date.now() - start > POLL_TIMEOUT_MS) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isTray]);

  return isTray;
}
