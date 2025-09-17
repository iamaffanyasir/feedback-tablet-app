import axios from "axios";

// The error shows you're still connecting to http://128.199.23.8:3001/api
// Let's make sure the HTTPS URL is used directly, without relying on env variables that might not be loaded
const API_BASE_URL = "https://128.199.23.8/api";

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
