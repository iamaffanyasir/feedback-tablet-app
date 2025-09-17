import axios from "axios";

// Check if on mobile device
const isMobile =
  /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );

// For all devices, use HTTPS
const API_BASE_URL = "https://128.199.23.8/api";

console.log("Using API URL:", API_BASE_URL);
console.log("Device Info:", navigator.userAgent);

// Create axios instance with mobile-friendly settings
const api = axios.create({
  baseURL: API_BASE_URL,
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

    console.log("Submitting feedback to:", `${API_BASE_URL}/feedback`);

    // Simplified approach - just use fetch API directly for all devices
    // This bypasses axios and its certificate validation
    try {
      // Make a direct JSON fetch request
      const fetchResponse = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(enhancedData),
      });

      // Check if the request was successful
      if (!fetchResponse.ok) {
        const errorText = await fetchResponse.text();
        console.error("Server responded with error:", fetchResponse.status, errorText);
        throw new Error(`Server error: ${fetchResponse.status}`);
      }

      // Parse the JSON response
      const responseData = await fetchResponse.json();
      console.log("Feedback submission successful:", responseData);
      return responseData;
    } catch (error) {
      console.error("Submission failed:", error);

      // Show user-friendly error on mobile
      if (isMobile) {
        alert(
          "Error submitting feedback. Please check your internet connection and try again."
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default api;
        }

        response = { data: await formResponse.json() };
      } catch (formError) {
        console.error("All submission methods failed:", formError);
        throw formError;
      }
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
