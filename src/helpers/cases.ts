import { MAX_SIZE_FILES } from "@/utils/constants-all";

export const isGreaterThanMaximumSize = (size: number) => {
  if (size > MAX_SIZE_FILES) {
    return true;
  }
  return false;
};
