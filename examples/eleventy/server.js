import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "dist");

const routes = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/about", "about.html"],
  ["/about/", "about.html"],
  ["/about.html", "about.html"],
  ["/product", "product.html"],
  ["/product/", "product.html"],
  ["/product.html", "product.html"],
]);

const port = Number(process.env.PORT) || 8099;

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", "http://localhost");
  const file = routes.get(url.pathname);
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  const html = fs.readFileSync(path.join(dist, file));
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(html);
});

server.listen(port, "localhost", () => {
  console.log("http://localhost:" + port);
});
