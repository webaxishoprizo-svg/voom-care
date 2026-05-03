import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8082,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      {
        name: "api-newsletter",
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === "/api/newsletter" && req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk.toString();
              });

              req.on("end", async () => {
                try {
                  const { email } = JSON.parse(body);
                  const SHOP = env.SHOP || "shop.voomcare.com";
                  const ACCESS_TOKEN = env.ADMIN_API_TOKEN;

                  if (!ACCESS_TOKEN) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ success: false, message: "Server config missing: ADMIN_API_TOKEN" }));
                    return;
                  }

                  const shopifyResponse = await fetch(`https://${SHOP}/admin/api/2024-01/customers.json`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "X-Shopify-Access-Token": ACCESS_TOKEN,
                    },
                    body: JSON.stringify({
                      customer: {
                        email: email,
                        accepts_marketing: true,
                        marketing_opt_in_level: "single_opt_in",
                        email_marketing_consent: {
                          state: "subscribed",
                          opt_in_level: "single_opt_in",
                        },
                        tags: "newsletter",
                      },
                    }),
                  });

                  const data = (await shopifyResponse.json()) as { errors?: { email?: string[] } };
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");

                  if (shopifyResponse.ok) {
                    res.end(JSON.stringify({ success: true }));
                  } else {
                    if (data.errors && data.errors.email) {
                      const isDuplicate = data.errors.email.some((err: string) =>
                        err.includes("already been taken") || err.includes("exists") || err.includes("already")
                      );
                      if (isDuplicate) {
                        res.end(JSON.stringify({ success: true, message: "Already subscribed" }));
                        return;
                      }
                    }
                    res.end(JSON.stringify({ success: false, message: "Subscription error", error: data }));
                  }
                } catch (error) {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ success: false, message: error instanceof Error ? error.message : "An unknown error occurred" }));
                }
              });
              return;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
    },
  };
});
