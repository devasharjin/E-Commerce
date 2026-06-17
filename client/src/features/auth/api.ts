import { apiGet, apiPost } from "@/lib/api";
import type { MeResponse } from "./type";

/**
 * Redirect user to backend Google OAuth
 */
export function loginWithGoogle() {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
}

/**
 * Get logged-in user (cookie-based session)
 */
export function getMe() {
  return apiGet<MeResponse>("/auth/me");
}

export function logout() {
  return apiPost<any>("/auth/logout");
}

