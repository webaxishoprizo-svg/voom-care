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

    const trackResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!trackResponse.ok) {
      if (trackResponse.status === 404) {
         return res.status(404).json({ error: "Tracking ID not found." });
      }
      throw new Error(`Shiprocket tracking API failed with status: ${trackResponse.status}`);
    }

    const data = await trackResponse.json();

    // The tracking API might return data in different formats based on tracking status.
    // Usually it's in data.tracking_data
    if (data.tracking_data && data.tracking_data.error) {
       return res.status(404).json({ error: data.tracking_data.error });
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
      orderId: shipmentTrack.awb_code || awb,
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
