import axios from "axios";

const axiosAuth = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptors
axiosAuth.interceptors.request.use(
  (config) => {
    config.headers.common["Authorization"] = `Bearer ${localStorage.getItem(
      "token"
    )}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptors
axiosAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;
