export interface PywebviewApi {
  on_blur?: () => void;
  close_app?: () => void;
  minimise?: () => void;
  toggle_expand?: () => void;
  toggle_pin?: () => Promise<boolean> | boolean;
}

declare global {
  interface Window {
    pywebview?: {
      api: PywebviewApi;
    };
  }
}

function callApi(method: keyof PywebviewApi): void {
  window.pywebview?.api?.[method]?.();
}

export function closeTrayWindow(): void {
  callApi("close_app");
}

export function minimiseTrayWindow(): void {
  callApi("minimise");
}

export function toggleExpandTrayWindow(): void {
  callApi("toggle_expand");
}

export async function toggleTrayPin(): Promise<boolean> {
  return (await window.pywebview?.api?.toggle_pin?.()) ?? false;
}
