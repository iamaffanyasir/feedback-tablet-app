import { io } from "socket.io-client";

// Check if on mobile device
const isMobile =
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );

// Use HTTP for mobile to avoid certificate issues
const SOCKET_URL = isMobile ? "http://128.199.23.8" : "https://128.199.23.8";

console.log("Using Socket URL:", SOCKET_URL);

class SocketService {
  constructor() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.emittedFeedbacks = new Set();

    // Add connection event handlers for debugging
    this.socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  emitFeedback(feedbackData) {
    if (this.socket && this.socket.connected) {
      // Create a unique identifier for this feedback
      const feedbackId = `${feedbackData.name}-${
        feedbackData.email
      }-${Date.now()}`;

      // Check if we've already emitted this feedback
      if (!this.emittedFeedbacks.has(feedbackId)) {
        this.emittedFeedbacks.add(feedbackId);
        this.socket.emit("newFeedback", feedbackData);
        console.log("Feedback emitted:", feedbackData);

        // Clean up after a delay to prevent memory leaks
        setTimeout(() => {
          this.emittedFeedbacks.delete(feedbackId);
        }, 10000);
      } else {
        console.log("Duplicate feedback emission prevented");
      }
    } else {
      console.error("Socket not connected");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

const socketService = new SocketService();

export const emitFeedback = (feedbackData) => {
  socketService.emitFeedback(feedbackData);
};

export default socketService;
