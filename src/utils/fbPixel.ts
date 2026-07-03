/**
 * Custom Facebook Ads Pixel & Event Tracking Utility
 * 
 * Provides unified helper functions to log eCommerce actions,
 * store tracking histories for the live debugger panel,
 * and invoke actual Facebook Pixel scripts if configured.
 */

export interface PixelLog {
  id: string;
  event: string;
  data: any;
  timestamp: string;
  path: string;
}

/**
 * Tracks an event and dispatches notifications for the live monitor.
 */
export const trackFbEvent = (eventName: string, data?: any) => {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const eventId = String(Date.now() + Math.random());

  const newLog: PixelLog = {
    id: eventId,
    event: eventName,
    data: data || {},
    timestamp,
    path
  };

  // 1. Maintain in-memory logs
  if (!(window as any).zarkaPixelEvents) {
    (window as any).zarkaPixelEvents = [];
  }
  (window as any).zarkaPixelEvents.unshift(newLog);

  // Keep log size bounded
  if ((window as any).zarkaPixelEvents.length > 100) {
    (window as any).zarkaPixelEvents.pop();
  }

  // 2. Persist to localStorage for cross-tab or cross-session capability
  try {
    const existing = localStorage.getItem("zarka_pixel_logs");
    const logs: PixelLog[] = existing ? JSON.parse(existing) : [];
    logs.unshift(newLog);
    localStorage.setItem("zarka_pixel_logs", JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.error("Failed to persist pixel log", e);
  }

  // 3. Dispatch a custom window event to notify active React components (e.g. debugger panels)
  const event = new CustomEvent("zarka-pixel-event", { detail: newLog });
  window.dispatchEvent(event);

  // 4. Trigger the actual Facebook Pixel script if loaded
  if ((window as any).fbq) {
    try {
      (window as any).fbq("track", eventName, data);
    } catch (err) {
      console.warn("Failed to trigger Facebook fbq script", err);
    }
  }


};
