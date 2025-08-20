import {
  useMutation,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  DepartmentsResponse,
  DepartmentUpdate,
} from "@/types/api/admin/departments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

/**
 * @description
 * Departments Hook
 * @returns {UseQueryResult<DepartmentsResponse>}
 */
export const useDepartments = (
  page: number,
  pageSize: number,
  keyword: string
): UseQueryResult<DepartmentsResponse> => {
  return useQuery({
    queryKey: ["departments", page, pageSize, keyword],
    queryFn: () =>
      axios.get("/api/admin/departments", {
        params: { page, pageSize, keyword },
      }),
    select: (data) => data.data,
  });
};

/**
 * @description
 * Update Department Hook
 * @returns {UseMutationResult<DepartmentUpdate>}
 */
export const useUpdateDepartment = (): UseMutationResult<
  DepartmentUpdate,
  Error,
  DepartmentUpdate
> => {
  return useMutation<DepartmentUpdate, Error, DepartmentUpdate>({
    mutationFn: async (department) => {
      const res = await axios.patch<DepartmentUpdate>(
        `/api/admin/departments/${department.department_id}/update`,
        department
      );
      return res.data;
    },
  });
};
