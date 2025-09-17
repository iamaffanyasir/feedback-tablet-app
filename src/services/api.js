import axios from "axios";

// Use the environment variable with direct fallback to HTTPS
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://128.199.23.8/api";

console.log("Using API URL:", API_BASE_URL);

// Create axios instance with timeout and retry logic
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    console.error("API Request Failed:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export const submitFeedback = async (feedbackData) => {
  try {
    // Log the request being made
    console.log("Submitting feedback to:", `${API_BASE_URL}/feedback`);
    console.log("Feedback data:", feedbackData);

    const response = await api.post("/feedback", feedbackData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default api;
