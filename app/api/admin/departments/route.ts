import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { DepartmentsResponse } from "@/types/api/admin/departments";

/**
 * @swagger
 * /api/admin/departments:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get departments
 *     description: Returns a paginated list of departments with task counts.
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
 *                       department_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       code:
 *                         type: string
 *                       manager_id:
 *                         type: string
 *                       manager_name:
 *                         type: string
 *                       employee_count:
 *                         type: integer
 *                       budget:
 *                         type: integer
 *                       level:
 *                         type: string
 *                       location:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       email:
 *                         type: string
 *                       established_date:
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
 *                   - department_id: 1
 *                     department_name: "Development"
 *                     code: "DEV"
 *                     description: "Tasks related to software development"
 *                     manager_id: "user1"
 *                     manager_name: "John Smith"
 *                     level: "operational"
 *                     budget: 500000
 *                     location: "Floor 3, Building A"
 *                     phone: "+81-3-1234-5678"
 *                     email: "development@startup.com"
 *                     created_at: "2025-08-19T07:58:02.838286+00:00"
 *                     updated_at: "2025-08-19T07:58:02.838286+00:00"
 *                     employee_count: 25
 *                     status: true
 *                     department_completion_percentage: 87
 *                     department_productivity_percentage: 92
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

  // 1. Get departments
  const { data, error, count } = await supabase
    .from("department_task_stats")
    .select("*", { count: "exact" })
    .ilike("department_name", `%${keyword}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.DEPARTMENTS.FETCH_FAILED,
      500
    );
  }
  
  return successResponse(
    {
      data,
      total: count ?? 0,
      page,
      pageSize,
    } as unknown as DepartmentsResponse,
    MESSAGES.DEPARTMENTS.FETCH_SUCCESS
  );
};
