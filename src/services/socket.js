import { io } from "socket.io-client";

// Make sure this is using the HTTPS URL
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "https://128.199.23.8";

class SocketService {
  constructor() {
    this.socket = null;
    this.connect();
    // To prevent duplicate emissions
    this.emittedFeedbacks = new Set();
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Connected to server:", this.socket.id);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
      // Clear the set on disconnect to prevent memory leaks
      this.emittedFeedbacks.clear();
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
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
