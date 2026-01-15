/**
 * 2025年5月イベント専用のエンドポイント設定
 * このイベントでのみ使用される環境変数とエンドポイントを管理
 */

function getRequiredEnv(key: string): string {
  const value = import.meta.env[key];

  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      `Environment variable ${key} is required but not set. ` + `Please set it in your .env file.`
    );
  }

  return value.trim();
}

function validateUrl(url: string, varName: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    // 相対URLの場合はそのまま返す(開発環境用)
    if (url.startsWith("/")) {
      return url;
    }
    throw new Error(
      `Environment variable ${varName} must be a valid URL or absolute path. ` + `Received: ${url}`
    );
  }
}

export const ENDPOINT_MEDIA_PATH = validateUrl(
  getRequiredEnv("PUBLIC_MEDIA_PATH"),
  "PUBLIC_MEDIA_PATH"
);

export const ENDPOINT_MEDIA_API = validateUrl(
  getRequiredEnv("PUBLIC_MEDIA_API"),
  "PUBLIC_MEDIA_API"
);

export const ENDPOINT_LIST = `${ENDPOINT_MEDIA_API}list/`;
export const ENDPOINT_UPLOAD_IMAGES = `${ENDPOINT_MEDIA_API}upload-images/`;
