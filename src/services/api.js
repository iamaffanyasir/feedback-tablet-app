import axios from "axios";

// Use HTTPS without the port
const API_BASE_URL = "https://128.199.23.8/api";

// Fallback to HTTP for mobile devices to bypass certificate issues
const isMobile =
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );

// Use HTTP for mobile devices to avoid certificate issues
const MOBILE_API_BASE_URL = "http://128.199.23.8/api";

console.log("Using API URL:", isMobile ? MOBILE_API_BASE_URL : API_BASE_URL);
console.log("Device Info:", navigator.userAgent);

// Create axios instance with mobile-friendly settings
const api = axios.create({
  baseURL: isMobile ? MOBILE_API_BASE_URL : API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add these headers to help with mobile compatibility
    Accept: "application/json, text/plain, */*",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
  // Longer timeout for slower mobile connections
  timeout: 30000,
  // Retry failed requests
  retry: 3,
  retryDelay: 1000,
});

// Add detailed logging for debugging
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.url);
    console.log("Request data:", JSON.stringify(config.data));
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  async (error) => {
    // Get config and determine if we should retry
    const { config } = error;

    // Log detailed error information
    console.error("API Request Failed:", {
      url: config?.url,
      method: config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Implement retry logic for network errors
    if (error.message === "Network Error" && config && config.retry) {
      // Set a backoff factor for retry
      const backoff = config.retryDelay || 1000;

      // Decrease the number of retries left
      config.retry -= 1;

      // Wait for the backoff period
      await new Promise((resolve) => setTimeout(resolve, backoff));

      console.log(
        `Retrying request to ${config.url}, ${config.retry} retries left`
      );

      // Return the promise of the new request
      return api(config);
    }

    return Promise.reject(error);
  }
);

export const submitFeedback = async (feedbackData) => {
  try {
    // Add device info for debugging
    const enhancedData = {
      ...feedbackData,
      _meta: {
        device: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
    };

    const endpoint = isMobile ? MOBILE_API_BASE_URL : API_BASE_URL;
    console.log("Submitting feedback to:", `${endpoint}/feedback`);

    // Use fetch API as backup if axios fails
    let response;
    try {
      response = await api.post("/feedback", enhancedData);
    } catch (axiosError) {
      console.log("Axios failed, trying fetch API as backup");

      // For mobile, try with HTTP explicitly as a workaround for certificate issues
      const fetchUrl = isMobile
        ? `http://128.199.23.8/api/feedback`
        : `${API_BASE_URL}/feedback`;

      console.log("Fetch fallback using URL:", fetchUrl);

      // Try with fetch API as a backup method
      const fetchResponse = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(enhancedData),
      });

      if (!fetchResponse.ok) {
        throw new Error(`Fetch failed with status ${fetchResponse.status}`);
      }

      response = { data: await fetchResponse.json() };
    }

    console.log("Feedback submission successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);

    // Show more user-friendly error on mobile
    if (isMobile) {
      alert(
        "Error submitting feedback. Please check your internet connection and try again."
      );
    }

    throw error;
  }
};

export default api;
