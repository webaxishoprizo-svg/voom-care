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
            const url = req.url ? new URL(req.url, `http://${req.headers.host}`) : null;

            // Newsletter API
            if (req.url === "/api/newsletter" && req.method === "POST") {
              let body = "";
              req.on("data", (chunk) => { body += chunk.toString(); });
              req.on("end", async () => {
                try {
                  const { email } = JSON.parse(body);
                  const SHOP = env.VITE_SHOPIFY_DOMAIN || "voomcare.myshopify.com";
                  const ACCESS_TOKEN = env.ADMIN_API_TOKEN;
                  if (!ACCESS_TOKEN) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ success: false, message: "Server config missing: ADMIN_API_TOKEN" }));
                    return;
                  }
                  const shopifyResponse = await fetch(`https://${SHOP}/admin/api/2024-01/customers.json`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": ACCESS_TOKEN },
                    body: JSON.stringify({ customer: { email, accepts_marketing: true, tags: "newsletter" } }),
                  });
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ success: shopifyResponse.ok }));
                } catch (error) {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ success: false, message: "Error" }));
                }
              });
              return;
            }

            // Review Eligibility Check for Local Dev
            if (req.url?.startsWith("/api/review/eligibility")) {
              const productId = url?.searchParams.get("product_id");
              const customerId = url?.searchParams.get("customer_id");
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              
              // In local dev, we'll allow the button if logged in
              res.end(JSON.stringify({ 
                eligible: !!customerId, 
                hasReviewed: false, 
                resolvedId: "local-dev-id" 
              }));
              return;
            }

            // Reviews Fetch (Handled primarily by frontend mocks now, but this avoids 404s)
            if (req.url?.startsWith("/api/reviews")) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ reviews: [], stats: { averageRating: 5.0, totalReviews: 15 }, pagination: { page: 1, pages: 1 } }));
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
