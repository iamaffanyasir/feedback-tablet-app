import axios from "axios";

// You're still using the HTTP version - we need to ensure it's using the HTTPS URL from env variables
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://128.199.23.8/api";

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
