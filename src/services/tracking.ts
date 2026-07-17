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
  try {
    const response = await fetch(`/api/track?id=${encodeURIComponent(trackingId)}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Tracking failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect to tracking API");
  }
};
