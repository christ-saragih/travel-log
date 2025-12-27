import { apiClient } from "@/lib/axios";
import type { LoginSchema, RegisterSchema } from "@/schemas/auth.schema";
import type { LoginResponse } from "@/types/auth.types";

export const authService = {
  register: async (data: RegisterSchema): Promise<LoginResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...payload } = data;
    const response = await apiClient.post<LoginResponse>(
      "/auth/local/register",
      payload,
    );
    return response.data;
  },
  login: async (data: LoginSchema): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>("/auth/local", data);
    return response.data;
  },
};
