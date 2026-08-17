export const KODO_BASE_URL: string = "http://localhost:5636";

export async function getTaskRunningStatus(): Promise<{
  running: boolean;
  task: string | null;
}> {
  const res = await fetch(KODO_BASE_URL + "/run/status");
  if (!res.ok) throw new Error("API unavailable");
  return res.json();
}

export default KODO_BASE_URL;
