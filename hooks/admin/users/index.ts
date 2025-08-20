import axios from "axios";
import { UseQueryResult } from "@tanstack/react-query";
import { UsersNamesResponse } from "@/types/api/admin/users";
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
