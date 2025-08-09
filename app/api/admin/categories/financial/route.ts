"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { FinancialCategoriesResponse } from "@/types/api/admin/categories/financial";

/**
 * @swagger
 * /api/admin/categories/financial:
 *   get:
 *     tags:
 *       - Financial Categories
 *     summary: Get financial categories
 *     description: Returns a paginated list of financial categories with financial counts.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: financialName
 *         schema:
 *           type: string
 *         description: Filter by financial name
 *       - in: query
 *         name: financialType
 *         schema:
 *           type: string
 *         description: Filter by financial type
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       is_active:
 *                         type: boolean
 *                       category_type:
 *                         type: string
 *                       tasks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             count:
 *                               type: integer
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *               example:
 *                 data:
 *                   - category_id: 1
 *                     name: "Development"
 *                     description: "Tasks related to software development"
 *                     is_active: true
 *                     category_type: "income"
 *                     tasks:
 *                       - count: 10
 *                 total: 1
 *                 page: 1
 *                 pageSize: 10
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *               example:
 *                 error: "Invalid data provided"
 */
export const GET = async (req: NextRequest): Promise<Response> => {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const financialName = searchParams.get("keyword") ?? "";
  const financialType = searchParams.get("financialType") ?? "";

  const from = (page - 1) * pageSize;
  const to = page * pageSize;

  let query = supabase
    .from("financial_categories")
    .select(
      `
        category_id,
        name,
        description,
        is_active,
        category_type,
        financial_records(count)
    `,
    { count: "exact" }
    )
    .ilike("name", `%${financialName}%`)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (financialType) {
    query = query.eq("category_type", financialType);
  }

  const { data, error, count } = await query;

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.FINANCIAL.FETCH_FAILED,
      500
    );
  }

  return successResponse(
    {
      data,
      total: count ?? 0,
      page,
      pageSize,
    } as unknown as FinancialCategoriesResponse,
    MESSAGES.CATEGORIES.FINANCIAL.FETCH_SUCCESS
  );
};
