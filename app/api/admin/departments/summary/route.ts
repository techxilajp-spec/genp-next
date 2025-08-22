import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { DepartmentSummary } from "@/types/api/admin/departments";

/**
 * @swagger
 * /api/admin/departments/summary:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get department summary
 *     description: Returns a summary of departments.
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_departments:
 *                       type: integer
 *                     total_employees:
 *                       type: integer
 *                     avg_employees_per_department:
 *                       type: number
 *                     total_budget:
 *                       type: number
 *               example:
 *                 success: true
 *                 message: "Department summary fetched successfully"
 *                 data:
 *                   total_departments: 10
 *                   total_employees: 50
 *                   avg_employees_per_department: 5
 *                   total_budget: 100000
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
 *                 error: "Department summary not found"
 */
export const GET = async (): Promise<Response> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organization_summary")
    .select("*")
    .single();

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.DEPARTMENTS.FETCH_FAILED,
      500
    );
  }

  return successResponse(
    data as unknown as DepartmentSummary,
    MESSAGES.DEPARTMENTS.FETCH_SUCCESS
  );
};
