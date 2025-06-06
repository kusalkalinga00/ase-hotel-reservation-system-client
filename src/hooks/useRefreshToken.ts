"use client";
import axios from "@/lib/axios";
import { useSession, signOut } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    if (!session?.refreshToken) {
      console.log("No refresh token available");
      // signOut();
      return null;
    }

    try {
      console.log("refeshPayload", {});
      const res = await axios.post(`/auth/refresh`, {
        userId: session.user.id,
        refreshToken: session.refreshToken,
      });

      console.log("Refresh token success", res.data);

      if (!res.data?.payload?.token) {
        throw new Error("Invalid response format");
      }

      const newTokens = {
        accessToken: res.data.payload.token,
        refreshToken: res.data.payload.refreshToken,
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
