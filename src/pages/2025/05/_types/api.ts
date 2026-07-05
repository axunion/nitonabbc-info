export type FileListItem = {
  type: "file" | "directory";
  name: string;
  size?: number;
  lastModified?: string;
};

export type FetchFileListSuccessResponse = {
  status: "success";
  list: FileListItem[];
  total?: number;
  path?: string;
};

export type FetchFileListErrorResponse = {
  status: "error";
  message: string;
  code?: string;
};

export type FetchFileListResponse =
  | FetchFileListSuccessResponse
  | FetchFileListErrorResponse;

export type UploadImagesRequest = {
  path: string;
  images: File[];
};

export type UploadImagesSuccessResponse = {
  status: "success";
  files: string[];
  count?: number;
};

export type UploadImagesErrorResponse = {
  status: "error";
  message: string;
  code?: string;
  failedFiles?: string[];
};

export type UploadImagesResponse =
  | UploadImagesSuccessResponse
  | UploadImagesErrorResponse;
