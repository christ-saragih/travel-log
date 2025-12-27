import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor Request: attach Bearer token if available
apiClient.interceptors.request.use((config) => {
  // Allow callers to override Authorization manually
  if (config.headers?.Authorization) {
    return config;
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Interceptor Response (Opsional tapi Recommended)
// Berguna untuk menyederhanakan error handling nanti
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Bisa tambahkan logic global disini, misal: jika 401, auto logout
    return Promise.reject(error);
  },
);
