import type { UploadImagesRequest, UploadImagesResponse } from "@/types/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

function isValidUploadImagesResponse(
  data: unknown,
): data is UploadImagesResponse {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  if (obj.status === "error") {
    return typeof obj.message === "string";
  }

  if (obj.status === "success") {
    return (
      Array.isArray(obj.files) &&
      obj.files.every((file) => typeof file === "string")
    );
  }

  return false;
}

export const uploadImages = async (
  data: UploadImagesRequest,
  endpoint: string,
): Promise<UploadImagesResponse> => {
  for (const file of data.images) {
    if (file.size > MAX_FILE_SIZE) {
      return {
        status: "error",
        message: `File "${file.name}" exceeds maximum size (10MB)`,
      };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        status: "error",
        message: `File "${file.name}" has unsupported format (JPEG, PNG, WebP only)`,
      };
    }
  }

  const form = new FormData();
  form.append("path", data.path);

  for (const file of data.images) {
    form.append("images[]", file);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const res = await fetch(endpoint, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        status: "error",
        message: `Upload error: ${res.status}`,
      };
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        status: "error",
        message: "Invalid server response",
      };
    }

    const responseData = await res.json();

    if (isValidUploadImagesResponse(responseData)) {
      return responseData;
    }

    return {
      status: "error",
      message: "Invalid response structure",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        status: "error",
        message: "Upload timeout",
      };
    }

    return {
      status: "error",
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
};
