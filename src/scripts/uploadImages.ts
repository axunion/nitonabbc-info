import { ENDPOINT_UPLOAD_IMAGES } from "@/constants/config";
import type { UploadImagesRequest, UploadImagesResponse } from "@/types/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

function isValidUploadImagesResponse(data: unknown): data is UploadImagesResponse {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  if (obj.status === "error") {
    return typeof obj.message === "string";
  }

  if (obj.status === "success") {
    return Array.isArray(obj.files) && obj.files.every((file) => typeof file === "string");
  }

  return false;
}

export const uploadImages = async (
  data: UploadImagesRequest
): Promise<UploadImagesResponse> => {
  // ファイルサイズとMIMEタイプの事前検証
  for (const file of data.images) {
    if (file.size > MAX_FILE_SIZE) {
      return {
        status: "error",
        message: `ファイル "${file.name}" のサイズが大きすぎます(最大10MB)`,
      };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        status: "error",
        message: `ファイル "${file.name}" の形式が対応していません(JPEG、PNG、WebPのみ)`,
      };
    }
  }

  const form = new FormData();
  form.append("path", data.path);

  data.images.forEach((file) => {
    form.append("images[]", file);
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒タイムアウト

    const res = await fetch(ENDPOINT_UPLOAD_IMAGES, {
      method: "POST",
      body: form,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        status: "error",
        message: `アップロードエラー: ${res.status}`,
      };
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        status: "error",
        message: "サーバーからの応答が不正です",
      };
    }

    const responseData = await res.json();

    // 型ガードによる検証
    if (isValidUploadImagesResponse(responseData)) {
      return responseData;
    }

    return {
      status: "error",
      message: "サーバーからの応答形式が不正です",
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        status: "error",
        message: "アップロードがタイムアウトしました",
      };
    }

    return {
      status: "error",
      message: error instanceof Error ? error.message : "アップロードに失敗しました",
    };
  }
};
