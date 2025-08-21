import {
  useMutation,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  DepartmentCreate,
  DepartmentDetail,
  DepartmentEmployees,
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
 * Department Detail Hook
 * @returns {UseQueryResult<DepartmentDetail>}
 */
export const useDepartmentDetail = (
  id: string
): UseQueryResult<DepartmentDetail> => {
  return useQuery({
    queryKey: ["department-detail", id],
    queryFn: () =>
      axios.get("/api/admin/departments", {
        params: { id },
      }),
    select: (data) => data.data,
  });
};

/**
 * @description
 * Department Employees Hook
 * @returns {UseQueryResult<DepartmentEmployees>}
 */
export const useDepartmentEmployees = (
  id: string
): UseQueryResult<DepartmentEmployees> => {
  return useQuery({
    queryKey: ["department-employees", id],
    queryFn: () =>
      axios.get("/api/admin/departments/" + id + "/employees"),
    select: (data) => data.data,
  });
};

/**
 * @description
 * Create Department Hook
 * @returns {UseMutationResult<DepartmentCreate>}
 */
export const useCreateDepartment = (): UseMutationResult<
  DepartmentCreate,
  Error,
  DepartmentCreate
> => {
  return useMutation<DepartmentCreate, Error, DepartmentCreate>({
    mutationFn: async (department) => {
      const res = await axios.post<DepartmentCreate>(
        `/api/admin/departments/create`,
        department
      );
      return res.data;
    },
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
