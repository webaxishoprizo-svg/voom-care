import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 8082,
      hmr: {
        overlay: false,
      },
    },
    build: {
      target: "es2020",
      cssCodeSplit: true,
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return;
            if (id.includes("react-router")) return "react-vendor";
            if (id.match(/node_modules\/(react|react-dom|scheduler)\//)) return "react-vendor";
            if (id.includes("@tanstack")) return "query-vendor";
            if (id.includes("framer-motion")) return "motion-vendor";
            if (id.includes("lucide-react")) return "icons-vendor";
            if (id.includes("@radix-ui") || id.includes("sonner")) return "ui-vendor";
          },
        },
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
                  const SHOP = env.VITE_SHOPIFY_DOMAIN || "voom-9527.myshopify.com";
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

            // Shiprocket Tracking API (Local Dev Proxy)
            if (req.url?.startsWith("/api/track") && req.method === "GET") {
              const awb = url?.searchParams.get("id");
              if (!awb) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Missing tracking ID" }));
                return;
              }
              try {
                // Note: For local dev, we fetch token here. In production, api/track.ts handles it.
                const email = env.SHIPROCKET_API_EMAIL || "shipping@voomcare.com";
                const password = env.SHIPROCKET_API_PASSWORD || "1&fcOS&3PjEHYAi%Z8Gpjqm8maq8GL^A";
                
                const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password }),
                });
                
                if (!authRes.ok) throw new Error("Auth failed");
                const authData: any = await authRes.json();
                
                const cleanAwb = awb.replace(/\s+/g, '');
                let targetAwb = cleanAwb;
                const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanAwb);
                const isPhone = /^\+?[0-9]{10,15}$/.test(cleanAwb.replace(/[\s-]/g, ''));
            
                let data: any = null;
                let trackSuccess = false;

                if (!isEmail) {
                    const initialTrackRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${cleanAwb}`, {
                        headers: { Authorization: `Bearer ${authData.token}` }
                    });
                    if (initialTrackRes.ok) {
                        const tempData: any = await initialTrackRes.json();
                        if (!(tempData.tracking_data && tempData.tracking_data.error)) {
                            data = tempData;
                            trackSuccess = true;
                        }
                    }
                }

                if (!trackSuccess && (isEmail || isPhone)) {
                    const ordersRes = await fetch(`https://apiv2.shiprocket.in/v1/external/orders?per_page=100`, {
                      headers: { Authorization: `Bearer ${authData.token}` }
                    });
                    if (!ordersRes.ok) throw new Error("Failed to fetch orders for search.");
                    const ordersData: any = await ordersRes.json();
                    const orders = ordersData.data || [];
                    
                    const matchingOrder = orders.find((o: any) => {
                       const oEmail = o.customer_email || o.billing_email || "";
                       const oPhone = o.customer_phone || o.billing_phone || "";
                       return (isEmail && oEmail.toLowerCase() === cleanAwb.toLowerCase()) || 
                              (isPhone && oPhone.replace(/[\s-]/g, '').includes(cleanAwb.replace(/[\s-]/g, '')));
                    });
                    
                    if (!matchingOrder) {
                       res.statusCode = 404;
                       res.end(JSON.stringify({ error: `No recent orders found for this ${isEmail ? 'email' : 'phone number'}.` }));
                       return;
                    }
                    if (!matchingOrder.awb_code) {
                       res.statusCode = 404;
                       res.end(JSON.stringify({ error: "Your order is being processed and hasn't been shipped yet." }));
                       return;
                    }
                    targetAwb = matchingOrder.awb_code;

                    const fallbackTrackRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${targetAwb}`, {
                      headers: { Authorization: `Bearer ${authData.token}` }
                    });
                    
                    if (fallbackTrackRes.ok) {
                        const fallbackData: any = await fallbackTrackRes.json();
                        if (fallbackData.tracking_data && fallbackData.tracking_data.error) {
                            res.statusCode = 404;
                            res.end(JSON.stringify({ error: fallbackData.tracking_data.error }));
                            return;
                        }
                        data = fallbackData;
                        trackSuccess = true;
                    }
                }
                
                if (!trackSuccess || !data) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: "Tracking ID not found." }));
                    return;
                }
                
                const shipmentTrack = data.tracking_data?.shipment_track?.[0];
                const shipmentActivities = data.tracking_data?.shipment_track_activities || [];
                
                if (!shipmentTrack) {
                   res.statusCode = 404;
                   res.end(JSON.stringify({ error: "No tracking data available for this ID." }));
                   return;
                }
                
                const formattedData = {
                  orderId: shipmentTrack.awb_code || targetAwb,
                  expectedDeliveryDate: shipmentTrack.expected_date || "Calculating...",
                  origin: shipmentTrack.origin || "Origin",
                  destination: shipmentTrack.destination || "Destination",
                  currentStatus: shipmentTrack.current_status || "Pending",
                  activities: shipmentActivities.map((activity: any, index: number) => ({
                    date: activity.date,
                    activity: activity.activity,
                    location: activity.location,
                    status: index === 0 ? "current" : "completed"
                  }))
                };
                
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(formattedData));
              } catch (e: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Local proxy error: " + e.message }));
              }
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
