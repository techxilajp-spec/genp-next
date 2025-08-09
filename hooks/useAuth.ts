import { useMutation, useQuery } from "@tanstack/react-query";
import { MESSAGES } from "@/types/messages";
import axios from "axios";

/**
 * GET USER API
 * @returns
 * @author Yan Naing Htwe
 */
export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/user");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * POST LOGIN API
 * @returns
 * @author Yan Naing Htwe
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const result = await res.data;

      if (res.status !== 200) {
        throw new Error(result?.message || MESSAGES.AUTH.LOGIN_FAILED);
      }

      return result;
    },
  });
};

/**
 * POST SIGNUP API
 * @returns
 * @author Yan Naing Htwe
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      username,
    }: {
      email: string;
      password: string;
      username: string;
    }) => {
      const res = await axios.post("/api/auth/signup", {
        email,
        password,
        username,
      });

      const result = await res.data;

      if (res.status !== 200) {
        throw new Error(result?.message || MESSAGES.AUTH.SIGNUP_FAILED);
      }

      return result;
    },
  });
};

/**
 * POST RESET PASSWORD API
 * @returns
 * @author Yan Naing Htwe
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await axios.post("/api/auth/reset-password", { email });

      if (res.status !== 200) {
        throw new Error(
          res.data?.message || MESSAGES.AUTH.RESET_PASSWORD_FAILED
        );
      }

      return res.data;
    },
  });
};

/**
 * POST CHANGE PASSWORD API
 * @returns
 * @author Yan Naing Htwe
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      password,
      confirmPassword,
    }: {
      password: string;
      confirmPassword: string;
    }) => {
      const res = await axios.post("/api/auth/change-password", {
        password,
        confirmPassword,
      });

      const result = await res.data;

      if (res.status !== 200) {
        throw new Error(
          result?.message || MESSAGES.AUTH.CHANGE_PASSWORD_FAILED
        );
      }

      return result;
    },
  });
};
