import { ENDPOINT_LIST } from "@/constants/config";
import type { FetchFileListResponse } from "@/types/api";

export const fetchFileList = async (
  path: string,
): Promise<FetchFileListResponse> => {
  const query = path ? `?path=${encodeURIComponent(path)}` : "";
  const res = await fetch(`${ENDPOINT_LIST}${query}`);

  return (await res.json()) as FetchFileListResponse;
};
