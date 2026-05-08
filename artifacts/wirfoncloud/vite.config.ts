import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { createServer as createNetServer, connect } from "net";

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 24427;

const basePath = process.env.BASE_PATH ?? "/";

function webviewProxyPlugin(vitePort: number, proxyPort: number): Plugin {
  return {
    name: "webview-proxy",
    configureServer() {
      if (vitePort === proxyPort) return;
      const server = createNetServer((src) => {
        const dst = connect(vitePort, "127.0.0.1");
        src.pipe(dst);
        dst.pipe(src);
        src.on("error", () => dst.destroy());
        dst.on("error", () => src.destroy());
      });
      server.listen(proxyPort, "0.0.0.0", () => {
        console.log(
          `[webview-proxy] :${proxyPort} → :${vitePort}  (webview bridge)`,
        );
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    webviewProxyPlugin(port, 5000),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
