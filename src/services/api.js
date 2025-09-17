import axios from "axios";

// Use HTTPS without the port
const API_BASE_URL = "https://128.199.23.8/api";

console.log("Using API URL:", API_BASE_URL);

// Create axios instance with better mobile support
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increase timeout for slower mobile connections
});

// Add detailed logging for debugging
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    console.log("Request data:", config.data);
    console.log("Request headers:", config.headers);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error("API Request Failed:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack,
    });
    return Promise.reject(error);
  }
);

export const submitFeedback = async (feedbackData) => {
  try {
    // Add timestamp and device info for debugging
    const enhancedData = {
      ...feedbackData,
      _debug: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      },
    };

    console.log("Submitting feedback to:", `${API_BASE_URL}/feedback`);
    console.log("Enhanced feedback data:", enhancedData);

    const response = await api.post("/feedback", enhancedData);
    console.log("Feedback submission successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    // Display more user-friendly error on mobile
    if (
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        navigator.userAgent.toLowerCase()
      )
    ) {
      alert(
        "Error submitting feedback. Please check your internet connection and try again."
      );
    }
    throw error;
  }
};

export default api;
