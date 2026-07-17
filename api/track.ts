import type { VercelRequest, VercelResponse } from "@vercel/node";

// Cache token in memory since Vercel functions can stay warm
let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

async function getShiprocketToken(): Promise<string> {
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;

  if (!email || !password) {
    throw new Error("Shiprocket credentials are not configured in environment variables.");
  }

  // If we have a cached token and it hasn't expired (assuming 9 days validity to be safe), return it
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to authenticate with Shiprocket API. Response: ${response.status} ${errText}`);
  }

  const data = await response.json();
  cachedToken = data.token;
  // Token expires in 10 days, cache for 9 days
  tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000;

  return data.token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers for local development
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const awb = req.query.id as string;

  if (!awb) {
    return res.status(400).json({ error: "Missing tracking ID (AWB)" });
  }

  try {
    const token = await getShiprocketToken();

    const cleanAwb = awb.replace(/\s+/g, '');
    let targetAwb = cleanAwb;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanAwb);
    const isPhone = /^\+?[0-9]{10,15}$/.test(cleanAwb.replace(/[\s-]/g, ''));

    let data: any = null;
    let trackSuccess = false;

    // Try tracking directly if it's not explicitly an email
    if (!isEmail) {
        const initialTrackRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${cleanAwb}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (initialTrackRes.ok) {
            const tempData: any = await initialTrackRes.json();
            if (!(tempData.tracking_data && tempData.tracking_data.error)) {
                data = tempData;
                trackSuccess = true;
            }
        }
    }

    // If direct tracking failed (or it's an email), try order search
    if (!trackSuccess && (isEmail || isPhone)) {
        const ordersRes = await fetch(`https://apiv2.shiprocket.in/v1/external/orders?per_page=100`, {
          headers: { Authorization: `Bearer ${token}` }
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
           return res.status(404).json({ error: `No recent orders found for this ${isEmail ? 'email' : 'phone number'}.` });
        }
        let targetAwb = matchingOrder.awb_code || matchingOrder.shipments?.[0]?.awb || matchingOrder.shipments?.[0]?.awb_code;
        
        if (!targetAwb && matchingOrder.id) {
            const detailRes = await fetch(`https://apiv2.shiprocket.in/v1/external/orders/show/${matchingOrder.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (detailRes.ok) {
                const detailData: any = await detailRes.json();
                const detailedOrder = detailData.data;
                targetAwb = detailedOrder?.awb_code || detailedOrder?.shipments?.[0]?.awb || detailedOrder?.shipments?.[0]?.awb_code;
            }
        }
        
        if (!targetAwb) {
           return res.status(404).json({ error: "Your order is being processed and hasn't been shipped yet." });
        }

        // Track the newly found AWB
        const fallbackTrackRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${targetAwb}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (fallbackTrackRes.ok) {
            const fallbackData: any = await fallbackTrackRes.json();
            if (fallbackData.tracking_data && fallbackData.tracking_data.error) {
                return res.status(404).json({ error: fallbackData.tracking_data.error });
            }
            data = fallbackData;
            trackSuccess = true;
        }
    }

    if (!trackSuccess || !data) {
        return res.status(404).json({ error: "Tracking ID not found." });
    }

    const shipmentTrack = data.tracking_data?.shipment_track?.[0];
    const shipmentActivities = data.tracking_data?.shipment_track_activities || [];

    if (!shipmentTrack) {
        return res.status(404).json({ error: "No tracking data available for this ID." });
    }

    let orderDetails = null;
    if (shipmentTrack.order_id) {
       try {
          const detailRes = await fetch(`https://apiv2.shiprocket.in/v1/external/orders/show/${shipmentTrack.order_id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (detailRes.ok) {
             const detailData = await detailRes.json();
             orderDetails = detailData.data;
          }
       } catch (e) {
          console.error("Failed to fetch order details", e);
       }
    }

    // Map Shiprocket response to our frontend TrackingDetails interface
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
        status: index === 0 ? "current" : "completed" // Assuming activities are sorted descending
      })),
      products: orderDetails?.products?.map((p: any) => ({
         name: p.name, price: p.price, quantity: p.quantity, sku: p.sku
      })) || undefined,
      deliveryDetails: orderDetails ? {
         recipient: orderDetails.customer_name || "",
         phone: orderDetails.customer_phone || "",
         address: `${orderDetails.billing_address || ""}, ${orderDetails.billing_city || ""}, ${orderDetails.billing_state || ""} - ${orderDetails.billing_pincode || ""}`.replace(/^, | , | - $/g, ''),
         paymentMethod: orderDetails.payment_method || ""
      } : undefined
    };

    res.status(200).json(formattedData);
  } catch (error: any) {
    console.error("Tracking API Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
