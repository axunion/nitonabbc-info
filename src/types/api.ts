export type FileListItem = {
  type: "file" | "directory";
  name: string;
};

export type FetchFileListSuccessResponse = {
  status: "success";
  list: FileListItem[];
};

export type FetchFileListErrorResponse = {
  status: "error";
  message: string;
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
};

export type UploadImagesErrorResponse = {
  status: "error";
  message: string;
};

export type UploadImagesResponse =
  | UploadImagesSuccessResponse
  | UploadImagesErrorResponse;
