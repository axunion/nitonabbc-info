import type { UploadImagesRequest, UploadImagesResponse } from "@/types/api";

export const uploadImages = async (
  data: UploadImagesRequest,
  endpoint: string,
): Promise<UploadImagesResponse> => {
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
      return { status: "error", message: `Upload error: ${res.status}` };
    }

    return (await res.json()) as UploadImagesResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { status: "error", message: "Upload timeout" };
    }
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Upload failed",
    };
  }
};
