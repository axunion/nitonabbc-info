import { ENDPOINT_UPLOAD_IMAGES } from "@/constants/config";
import type { UploadImagesRequest, UploadImagesResponse } from "@/types/api";

export const uploadImages = async (
  data: UploadImagesRequest,
): Promise<UploadImagesResponse> => {
  const form = new FormData();

  form.append("path", data.path);

  data.images.forEach((file) => {
    form.append("images[]", file);
  });

  const res = await fetch(ENDPOINT_UPLOAD_IMAGES, {
    method: "POST",
    body: form,
  });

  return (await res.json()) as UploadImagesResponse;
};
