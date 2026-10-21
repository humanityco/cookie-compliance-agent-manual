import Fastify from "fastify";
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

const app = Fastify({ logger: false });

app.get("/", async (_request, reply) => {
  return reply.type("text/html").send(page("home"));
});

app.get("/about", async (_request, reply) => {
  return reply.type("text/html").send(page("about"));
});

app.get("/product", async (_request, reply) => {
  return reply.type("text/html").send(page("product"));
});

const port = Number(process.env.PORT) || 8097;

await app.listen({ port, host: "localhost" });
console.log("http://localhost:" + port);
