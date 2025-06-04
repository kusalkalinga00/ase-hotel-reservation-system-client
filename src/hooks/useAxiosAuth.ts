"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { useRefreshToken } from "@/hooks/useRefreshToken";
import { axiosAuth } from "@/lib/axios";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();
  const refreshInProgress = useRef(false);

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && session?.accessToken) {
          config.headers["Authorization"] = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          error?.response?.status === 401 &&
          !prevRequest?.sent &&
          !refreshInProgress.current
        ) {
          prevRequest.sent = true;
          refreshInProgress.current = true;

          try {
            const newTokens = await refreshToken();

            if (!newTokens) {
              refreshInProgress.current = false;
              return Promise.reject(error);
            }

            // Use the fresh token directly from the response
            prevRequest.headers[
              "Authorization"
            ] = `Bearer ${newTokens.access_token}`;

            refreshInProgress.current = false;
            return axiosAuth(prevRequest);
          } catch (refreshError) {
            refreshInProgress.current = false;
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return axiosAuth;
};

export default useAxiosAuth;
