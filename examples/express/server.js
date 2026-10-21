import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const layout = fs.readFileSync(path.join(root, "templates", "layout.html"), "utf8");

function page(name) {
  const body = fs.readFileSync(path.join(root, "templates", name + ".html"), "utf8").trimEnd();
  const indented = body
    .split("\n")
    .map((line) => (line ? "        " + line : line))
    .join("\n");
  return layout.replace("<!--CONTENT-->", indented);
}

const app = express();
const port = Number(process.env.PORT) || 3010;

app.get("/", (_req, res) => {
  res.type("html").send(page("home"));
});

app.get("/about", (_req, res) => {
  res.type("html").send(page("about"));
});

app.get("/product", (_req, res) => {
  res.type("html").send(page("product"));
});

app.listen(port, () => {
  console.log("http://localhost:" + port);
});
