import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import {
  TaskCategoriesResponse,
  TaskCategoryCreate,
  TaskCategoryUpdate,
} from "@/types/api/admin/categories/task";
import axios from "axios";

/**
 * @description
 * Task Categories Hook
 * @returns {UseQueryResult<TaskCategoriesResponse>}
 */
export const useTaskCategories = (
  page: number,
  pageSize: number,
  keyword: string
): UseQueryResult<TaskCategoriesResponse> => {
  return useQuery({
    queryKey: ["task-categories", page, pageSize, keyword],
    queryFn: () =>
      axios.get("/api/admin/categories/task", {
        params: { page, pageSize, keyword },
      }),
    select: (data) => data.data,
  });
};

/**
 * @description
 * Create Task Category Hook
 * @returns {UseMutationResult<TaskCategoryCreate>}
 */
export const useCreateTaskCategory = (): UseMutationResult<
  TaskCategoryCreate,
  Error,
  TaskCategoryCreate
> => {
  return useMutation<TaskCategoryCreate, Error, TaskCategoryCreate>({
    mutationFn: async (category) => {
      const res = await axios.post<TaskCategoryCreate>(
        `/api/admin/categories/task/create`,
        category
      );
      return res.data;
    },
  });
};

/**
 * @description
 * Update Task Category Hook
 * @returns {UseMutationResult<TaskCategoryUpdate>}
 */
export const useUpdateTaskCategory = (): UseMutationResult<
  TaskCategoryUpdate,
  Error,
  TaskCategoryUpdate
> => {
  return useMutation<TaskCategoryUpdate, Error, TaskCategoryUpdate>({
    mutationFn: async (category) => {
      const res = await axios.patch<TaskCategoryUpdate>(
        `/api/admin/categories/task/${category.category_id}/update`,
        category
      );
      return res.data;
    },
  });
};
