import type { FetchFileListResponse } from "@/types/api";

export const fetchFileList = async (
  path: string,
  endpoint: string,
): Promise<FetchFileListResponse> => {
  const query = path ? `?path=${encodeURIComponent(path)}` : "";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${endpoint}${query}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return { status: "error", message: `HTTP error! status: ${res.status}` };
    }

    return (await res.json()) as FetchFileListResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { status: "error", message: "Request timeout" };
    }
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
