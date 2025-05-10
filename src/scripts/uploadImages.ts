import type { UploadImagesRequest, UploadImagesResponse } from "@/types/api";

const MEDIA_API = import.meta.env.PUBLIC_MEDIA_API ?? "";
const ENDPOINT = `${MEDIA_API}upload-images/`;

export const uploadImages = async (
  data: UploadImagesRequest,
): Promise<UploadImagesResponse> => {
  const form = new FormData();

  form.append("path", `youth-fellowship-camp-2025/photo-gallery/${data.path}/`);

  data.images.forEach((file) => {
    form.append("images[]", file);
  });

  const res = await fetch(ENDPOINT, {
    method: "POST",
    body: form,
  });

  return (await res.json()) as UploadImagesResponse;
};
