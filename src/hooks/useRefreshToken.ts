"use client";
import axios from "@/lib/axios";
import { useSession, signOut } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    if (!session?.refreshToken) {
      console.error("No refresh token available");
      signOut();
      return null;
    }

    try {
      const res = await axios.post(`/auth/refresh`, {
        refresh_token: session.refreshToken,
      });

      console.log("Refresh token success", res.data);

      if (!res.data?.payload?.access_token) {
        throw new Error("Invalid response format");
      }

      const newTokens = {
        accessToken: res.data.payload.access_token,
        refreshToken: res.data.payload.refresh_token,
      };

      // Update the session with the new tokens
      await update({
        ...session,
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });

      // Return the new tokens for immediate use
      return {
        access_token: newTokens.accessToken,
        refresh_token: newTokens.refreshToken,
      };
    } catch (error) {
      console.error("Refresh token failed", error);
      signOut();
      return null;
    }
  };

  return refreshToken;
};
