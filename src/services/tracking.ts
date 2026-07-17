export interface TrackingActivity {
  date: string; // e.g. "2026-05-01 10:30:00"
  activity: string; // e.g. "Picked up"
  location: string;
  status: "completed" | "current" | "pending";
}

export interface TrackingDetails {
  orderId: string;
  awbCode: string;
  courierName: string;
  currentStatus: string;
  expectedDeliveryDate: string;
  origin: string;
  destination: string;
  activities: TrackingActivity[];
}

export const fetchTrackingDetails = async (trackingId: string): Promise<TrackingDetails> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Throw error if tracking ID is explicitly known as bad
  if (trackingId.toLowerCase() === "error") {
    throw new Error("Invalid tracking ID or order not found.");
  }

  // TODO: Replace with real Shiprocket API call via your backend
  // const response = await fetch(`/api/track?id=${trackingId}`);
  // if (!response.ok) throw new Error('Tracking failed');
  // return response.json();

  // Mock successful response mapped to Shiprocket style data
  return {
    orderId: trackingId.startsWith("#") ? trackingId : `#VOOM-${trackingId.toUpperCase()}`,
    awbCode: `AWB${Math.floor(Math.random() * 100000000)}`,
    courierName: "Delhivery",
    currentStatus: "In Transit",
    expectedDeliveryDate: "May 06, 2026",
    origin: "Kochi Hub, Kerala",
    destination: "Mumbai, Maharashtra",
    activities: [
      {
        date: "2026-05-01 10:30:00",
        activity: "Shipment details received",
        location: "Kozhikode, Kerala",
        status: "completed",
      },
      {
        date: "2026-05-02 14:15:00",
        activity: "Shipment picked up",
        location: "Kozhikode, Kerala",
        status: "completed",
      },
      {
        date: "2026-05-03 09:45:00",
        activity: "Arrived at origin hub",
        location: "Kochi Hub, Kerala",
        status: "completed",
      },
      {
        date: "2026-05-04 18:20:00",
        activity: "In Transit to destination city",
        location: "En route to Mumbai",
        status: "current",
      },
      {
        date: "",
        activity: "Out for delivery",
        location: "Mumbai, Maharashtra",
        status: "pending",
      },
      {
        date: "",
        activity: "Delivered",
        location: "Mumbai, Maharashtra",
        status: "pending",
      },
    ],
  };
};
