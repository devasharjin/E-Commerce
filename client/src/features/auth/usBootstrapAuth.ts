import { useEffect } from "react";
import { useAuthStore } from "./store";
import { getMe } from "./api";

export function useBootstrapAuth() {
  const { setLoading, setError, setUser, clearAuth } =
    useAuthStore();

  useEffect(() => {
    async function run() {
      try {
        setLoading();

        const me = await getMe(); 

        setUser(me);
      } catch (error: any) {
        clearAuth();
        setError(error?.message ?? "Not authenticated");
      }
    }

    run();
  }, [setLoading, setError, setUser, clearAuth]);
}