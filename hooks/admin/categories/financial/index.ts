import axios from "axios";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { FinancialCategoriesResponse } from "@/types/api/admin/categories/financial";

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
