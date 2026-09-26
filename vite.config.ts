// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { handleApiRequest } from "./src/server/api-handler";

const apiPlugin = () => ({
  name: "swasthya-api-middleware",
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      const url = new URL(req.url, "http://localhost");
      if (url.pathname.startsWith("/api/db")) {
        let bodyText = "";
        if (req.method !== "GET" && req.method !== "HEAD") {
          for await (const chunk of req) {
            bodyText += chunk;
          }
        }
        const apiRes = await handleApiRequest(url.pathname, req.method, bodyText);
        if (apiRes) {
          res.writeHead(apiRes.status, apiRes.headers);
          res.end(apiRes.body);
          return;
        }
      }
      next();
    });
  },
});

export default defineConfig({
  vite: {
    plugins: [apiPlugin()],
    server: {
      allowedHosts: true,
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
