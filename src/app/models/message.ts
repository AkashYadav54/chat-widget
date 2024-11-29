interface SOP {
  id: string;        // Unique identifier for each SOP
  title: string;     // Title of the SOP (e.g., "Greeting", "Alert", etc.)
  description: string; // Description of the SOP
}

interface Alert {
  id: string;           // Unique identifier for the alert
  message: string;      // Alert message
  isRead: boolean;      // Whether the alert has been read or not
  timestamp: string;    // Timestamp of when the alert was received
}

interface NotificationData {
  alerts: Alert[];  // Array of alerts
  sops: SOP[];      // Array of SOPs (Standard Operating Procedures)
}
