export function convertImageToUrl(image) {
  const uintArray = new Uint8Array(image);
  const blob = new Blob([uintArray], { type: "image/jpeg" });
  return URL.createObjectURL(blob);
}
