export type FileListItem = {
  type: "file" | "directory";
  name: string;
  size?: number; // バイト数
  lastModified?: string; // ISO 8601形式
};

export type FetchFileListSuccessResponse = {
  status: "success";
  list: FileListItem[];
  total?: number; // 総数
  path?: string; // 現在のパス
};

export type FetchFileListErrorResponse = {
  status: "error";
  message: string;
  code?: string; // エラーコード(例: "NOT_FOUND", "PERMISSION_DENIED")
};

export type FetchFileListResponse = FetchFileListSuccessResponse | FetchFileListErrorResponse;

export type UploadImagesRequest = {
  path: string;
  images: File[];
};

export type UploadImagesSuccessResponse = {
  status: "success";
  files: string[]; // アップロードされたファイル名のリスト
  count?: number; // アップロードされたファイル数
};

export type UploadImagesErrorResponse = {
  status: "error";
  message: string;
  code?: string; // エラーコード
  failedFiles?: string[]; // 失敗したファイル名のリスト
};

export type UploadImagesResponse = UploadImagesSuccessResponse | UploadImagesErrorResponse;
