import { ApiResponse } from "@/types/api.types";
import { AuthPayload, IUser } from "@/types/auth-payload.types";
import axios, { AxiosError } from "axios";

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string
): Promise<ApiResponse<AuthPayload | null>> => {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;
    const payload = {
      name,
      email,
      password,
      role,
    };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await axios.post(endpoint, payload, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorPayload = axiosError.response?.data || "Something went wrong";
    console.debug("DEBUG: error while register with API ", errorPayload);
    return errorPayload as ApiResponse<null>;
  }
};

export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthPayload | null>> => {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
    const payload = {
      email,
      password,
    };

    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await axios.post(endpoint, payload, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorPayload = axiosError.response?.data || "Something went wrong";
    console.debug("DEBUG: error while authenticate with API ", errorPayload);
    return {
      message:
        typeof errorPayload === "string" ? errorPayload : "An error occurred",
      success: false,
      payload: null,
    };
  }
};

export const getMe = async (
  accessToken: string
): Promise<ApiResponse<IUser | null>> => {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/me`;
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await axios.get(endpoint, { headers });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorPayload = axiosError.response?.data || "Something went wrong";
    console.debug("DEBUG: error while authenticate with API ", errorPayload);
    return {
      message:
        typeof errorPayload === "string" ? errorPayload : "An error occurred",
      success: false,
      payload: null,
    };
  }
};
