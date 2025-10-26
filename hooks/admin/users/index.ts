import axios from "axios";
import { UseQueryResult } from "@tanstack/react-query";
import {
  UserProductivity,
  UsersNamesResponse,
  UsertaskData,
  UserTaskDetail,
  UserTasksDetailResponse,
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
 *  User Productivity Hook
 * @returns {UseQueryResult<DepartmentEmployees>}
 */
export const useUserProductivity = (): UseQueryResult<UserProductivity[]> => {
  return useQuery({
    queryKey: ["department-employees"],
    queryFn: () => axios.get("/api/admin/users/names"),
    select: (data) => data.data.data, // assuming { success, message, data }
  });
};

export const useUserTasksDetail = (
  userId: string
): UseQueryResult<UserTaskDetail[]> => {
  return useQuery({
    queryKey: ["user-tasks-detail", userId],
    queryFn: () => axios.get(`/api/admin/users/names/${userId}`),
    select: (data) => data.data,
    enabled: !!userId,
  });
};

export const useUserTasksData = (
  userId: string
): UseQueryResult<UsertaskData> => {
  return useQuery({
    queryKey: ["user-tasks-data", userId],
    queryFn: () => axios.get(`/api/admin/users/names/${userId}`),
    select: (data) => data.data,
    enabled: !!userId,
  });
};
