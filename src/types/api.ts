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
