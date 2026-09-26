import type { IncomingMessage, ServerResponse } from "node:http";
import { handleApiRequest } from "../src/server/api-handler";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  let bodyText = "";

  if (req.method !== "GET" && req.method !== "HEAD") {
    for await (const chunk of req) {
      bodyText += chunk;
    }
  }

  const result = await handleApiRequest(url.pathname, req.method || "GET", bodyText);
  if (result) {
    res.writeHead(result.status, result.headers);
    res.end(result.body);
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
}
