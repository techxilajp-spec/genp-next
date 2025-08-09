"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { TaskCategoriesResponse } from "@/types/api/admin/categories/task";

/**
 * @swagger
 * /api/admin/categories/task:
 *   get:
 *     tags:
 *       - Task Categories
 *     summary: Get task categories
 *     description: Returns a paginated list of task categories with task counts.
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
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Filter by category name
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
 *                       color:
 *                         type: string
 *                       is_active:
 *                         type: boolean
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
 *                     color: "#3B82F6"
 *                     is_active: true
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
  const keyword = searchParams.get("keyword") ?? "";

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("task_categories")
    .select(
      `
        category_id,
        name,
        description,
        color,
        is_active,
        tasks(count)
    `,
      { count: "exact" }
    )
    .ilike("name", `%${keyword}%`)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.TASK.FETCH_FAILED,
      500
    );
  }

  return successResponse(
    {
      data,
      total: count ?? 0,
      page,
      pageSize,
    } as unknown as TaskCategoriesResponse,
    MESSAGES.CATEGORIES.TASK.FETCH_SUCCESS
  );
};
