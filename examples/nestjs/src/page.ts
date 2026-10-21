import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");
const layout = fs.readFileSync(path.join(root, "templates", "layout.html"), "utf8");

export function page(name: string): string {
  const body = fs.readFileSync(path.join(root, "templates", name + ".html"), "utf8").trimEnd();
  const indented = body
    .split("\n")
    .map((line) => (line ? "        " + line : line))
    .join("\n");
  return layout.replace("<!--CONTENT-->", indented);
}
