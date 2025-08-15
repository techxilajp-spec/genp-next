import axios from "axios";
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";
import { FinancialCategoriesResponse, FinancialCategoryCreate, FinancialCategoryDelete, FinancialCategoryUpdate } from "@/types/api/admin/categories/financial";

/**
 * @description
 * Financial Categories Hook
 * @returns {UseQueryResult<FinancialCategoriesResponse>}
 */
export const useFinancialCategories = (
  page: number,
  pageSize: number,
  keyword: string
): UseQueryResult<FinancialCategoriesResponse> => {
  return useQuery({
    queryKey: ["financial-categories", page, pageSize, keyword],
    queryFn: () =>
      axios.get("/api/admin/categories/financial", {
        params: { page, pageSize, keyword },
      }),
    select: (data) => data.data,
  });
};

/**
 * @description
 * Create Financial Category Hook
 * @returns {UseMutationResult<FinancialCategoryCreate>}
 */
export const useCreateFinancialCategory = (): UseMutationResult<
  FinancialCategoryCreate,
  Error,
  FinancialCategoryCreate
> => {
  return useMutation<FinancialCategoryCreate, Error, FinancialCategoryCreate>({
    mutationFn: async (category) => {
      const res = await axios.post<FinancialCategoryCreate>(
        `/api/admin/categories/financial/create`,
        category
      );
      return res.data;
    },
  });
};

/**
 * @description
 * Update Financial Category Hook
 * @returns {UseMutationResult<FinancialCategoryUpdate>}
 */
export const useUpdateFinancialCategory = (): UseMutationResult<
  FinancialCategoryUpdate,
  Error,
  FinancialCategoryUpdate
> => {
  return useMutation<FinancialCategoryUpdate, Error, FinancialCategoryUpdate>({
    mutationFn: async (category) => {
      const res = await axios.patch<FinancialCategoryUpdate>(
        `/api/admin/categories/financial/${category.category_id}/update`,
        category
      );
      return res.data;
    },
  });
};

/**
 * @description
 * Delete Financial Category Hook
 * @returns {UseMutationResult<FinancialCategoryDelete>}
 */
export const useDeleteFinancialCategory = (): UseMutationResult<
  FinancialCategoryDelete,
  Error,
  { category_id: number }
> => {
  return useMutation<FinancialCategoryDelete, Error, { category_id: number }>({
    mutationFn: async ({ category_id }) => {
      const res = await axios.delete<FinancialCategoryDelete>(
        `/api/admin/categories/financial/${category_id}/delete`
      );
      return res.data;
    },
  });
};
