import axios from "axios";

const axiosAuth = axios.create({
  baseURL: "http://localhost:3000/api/v1/auth",
  headers: {
    "Content-Type": "application/json",
  },
  //   headers: { Authorization: "" },
});

// request interceptors
axiosAuth.interceptors.request.use(
  (config) => {
    config.headers.common["Authorization"] = `Bearer ${JSON.parse(
      localStorage.getItem("token")
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
      localStorage.setItem("logged", false);
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;
