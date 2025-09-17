import axios from "axios";

// Use the environment variable with direct fallback to HTTPS
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://128.199.23.8/api";

console.log("Using API URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post("/feedback", feedbackData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default api;
