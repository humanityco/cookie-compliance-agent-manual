import { serve } from "@hono/node-server";
import { Hono } from "hono";
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

const app = new Hono();

app.get("/", (c) => c.html(page("home")));
app.get("/about", (c) => c.html(page("about")));
app.get("/product", (c) => c.html(page("product")));

const port = 8102;

serve({ fetch: app.fetch, hostname: "localhost", port }, () => {
  console.log("http://localhost:" + port);
});
