import { useUserStore } from "@/app/store/userStore";
import axios from "axios";

const API = axios.create({
  baseURL: "https://referral-creditsystem-production.up.railway.app/api",
});

API.interceptors.request.use((config) => {
  const { token } = useUserStore.getState();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
