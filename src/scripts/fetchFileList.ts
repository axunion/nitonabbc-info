import { ENDPOINT_LIST } from "@/pages/2025/05/_config/endpoints";
import type { FetchFileListResponse } from "@/types/api";

function isValidFetchFileListResponse(
  data: unknown,
): data is FetchFileListResponse {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  if (obj.status === "error") {
    return typeof obj.message === "string";
  }

  if (obj.status === "success") {
    return (
      Array.isArray(obj.list) &&
      obj.list.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "type" in item &&
          (item.type === "file" || item.type === "directory") &&
          "name" in item &&
          typeof item.name === "string",
      )
    );
  }

  return false;
}

export const fetchFileList = async (
  path: string,
): Promise<FetchFileListResponse> => {
  const query = path ? `?path=${encodeURIComponent(path)}` : "";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒タイムアウト

    const res = await fetch(`${ENDPOINT_LIST}${query}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        status: "error",
        message: `HTTP error! status: ${res.status}`,
      };
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        status: "error",
        message: "Invalid response format",
      };
    }

    const data = await res.json();

    // 型ガードによる実行時検証
    if (isValidFetchFileListResponse(data)) {
      return data;
    }

    return {
      status: "error",
      message: "Invalid response structure",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        status: "error",
        message: "Request timeout",
      };
    }

    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
