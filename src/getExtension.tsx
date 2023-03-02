export default function getExtension(ext: string) {
  if (ext === "x-icon") return "ico";
  if (ext === "svg+xml") return "svg";
  return ext;
}
