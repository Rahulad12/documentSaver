import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  loginUser,
  registerUser,
} from "../service/auth.service";
import toast from "react-hot-toast";
import type { UserProfile } from "@/types";

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ["loginUser"],
    mutationFn: async (variables: { email: string; password: string }) => {
      const res = await loginUser(variables.email, variables.password);
      console.log(res);
      return res;
    },
    onSuccess: (res) => {
      sessionStorage.setItem("user_id", res.data.profile.id);
      sessionStorage.setItem("access_token", res.data.access_token);
      toast.success(res.data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ["registerUser"],
    mutationFn: async (variables: {
      name: string;
      email: string;
      password: string;
    }) => registerUser(variables.name, variables.email, variables.password),
    onSuccess: (data) => {
      toast.success(data.data.message);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      sessionStorage.removeItem("access_token");
    },
    onSuccess: () => {
      toast.success("Logout successfully");
    },
  });
};

export const useGetUserProfile = (id: string) => {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile", id],
    queryFn: async () => {
      const res = await getUserProfile(id);
      return res.data;
    },
    retry: 1,
    enabled: !!id,
  });
};
