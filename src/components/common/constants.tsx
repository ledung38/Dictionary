export function isImage(url: any) {
  const extension = url && url?.split(".").pop().toLowerCase();

  return ["jpg", "jpeg", "png", "bmp", "gif", "webp"].includes(extension);
}

export const VALUE_GENDER: { [key: string]: string } = {
  MALE: "Nam",
  FEMALE: "Nữ",
};
