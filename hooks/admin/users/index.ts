import axios from "axios";
import {
  useMutation,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  UsersNamesResponse,
  Users,
  UserResponse,
  UserDepartmentResponse,
  UserCreate,
} from "@/types/api/admin/users";
import { useQuery } from "@tanstack/react-query";
/**
 * @description
 * Users Names Hook
 * @returns {UseQueryResult<UsersNamesResponse>}
 */
export const useUsersNames = (): UseQueryResult<UsersNamesResponse> => {
  return useQuery({
    queryKey: ["usersNames"],
    queryFn: () => axios.get("/api/admin/users/names"),
    select: (data) => data.data,
  });
};

/**
 * @description
 * User Department name Hool
 * @return {UseQueryResult<UserDepartmentResponse>}
 */
export const useUserDepartmentNames =
  (): UseQueryResult<UserDepartmentResponse> => {
    return useQuery({
      queryKey: ["userDepartmentNames"],
      queryFn: () => axios.get("/api/admin/users/departments"),
      select: (data) => data.data,
    });
  };

/**
 * @description
 * User Hook
 * @returns {UseQueryResult<Users>}
 */
export const useUser = (
  page: number,
  pageSize: number,
  keyword: string
): UseQueryResult<UserResponse> => {
  return useQuery({
    queryKey: ["user", page, pageSize, keyword],
    queryFn: () =>
      axios.get("/api/admin/users", {
        params: { page, pageSize, keyword },
      }),
    select: (data) => data.data,
  });
};

/**
 * @description
 * Create user Hook
 * @return {UseMutationResult<UserCreate>}
 */
export const useCreateUser = (): UseMutationResult<
  UserCreate,
  Error,
  UserCreate
> => {
  return useMutation<UserCreate, Error, UserCreate>({
    mutationFn: async (user) => {
      const res = await axios.post<UserCreate>(`api/admin/users/create`, user);
      return res.data;
    },
  });
};
