import axiosInstance from "../api";

export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/core-api";
};

export const getAccessToken = async (): Promise<string | null> => {
  return localStorage.getItem("access_token");
};

export const setAccessToken = (token: string) => {
  localStorage.setItem("access_token", token);
};
export const isAuthenticate = () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    return true;
  }
  return false;
};
export const loginUser = async (email: string, password: string) => {
  return axiosInstance.post("/auth/login", { email, password });
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  return axiosInstance.post("/auth/register", {
    name,
    email,
    password,
  });
};

export const getUserProfile = async (id: string | null) => {
  return axiosInstance.get(`/auth/profile/${id}`);
};
