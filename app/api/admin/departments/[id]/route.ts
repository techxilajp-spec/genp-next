import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";
import { DepartmentDetail } from "@/types/api/admin/departments";

/**
 * @swagger
 * /api/admin/departments/{id}:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get a department by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the department
 *     responses:
 *       200:
 *         description: Department fetched successfully
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
 *                     department_id:
 *                       type: string
 *                     department_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     code:
 *                       type: string
 *                     manager_id:
 *                       type: string
 *                     manager_name:
 *                       type: string
 *                     employee_count:
 *                       type: number
 *                     budget:
 *                       type: number
 *                     level:
 *                       type: string
 *                     location:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                     status:
 *                       type: boolean
 *                     created_at:
 *                       type: string
 *                     updated_at:
 *                       type: string
 *                     employees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user_id:
 *                             type: string
 *                           username:
 *                             type: string
 *                           email:
 *                             type: string
 *                           joined_at:
 *                             type: string
 *             example:
 *               success: true
 *               message: "Department fetched successfully"
 *               data:
 *                 department_id: 1
 *                 department_name: "Development"
 *                 description: "Tasks related to software development"
 *                 code: "DEV"
 *                 manager_id: "1"
 *                 manager_name: "John Doe"
 *                 employee_count: 10
 *                 budget: 100000
 *                 level: "executive"
 *                 location: "New York"
 *                 phone: "1234567890"
 *                 email: "john.doe@example.com"
 *                 created_at: "2022-01-01T00:00:00.000Z"
 *                 updated_at: "2022-01-01T00:00:00.000Z"
 *                 employees: [
 *                   {
 *                     user_id: "1",
 *                     username: "John Doe",
 *                     email: "john.doe@example.com",
 *                     joined_at: "2022-01-01T00:00:00.000Z"
 *                   }
 *                 ]
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
 *                 error: "Department not found"
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const departmentId = String((await params).id);

  const { data, error } = await supabase
    .from("department_with_employees")
    .select(`*`)
    .eq("department_id", departmentId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.DEPARTMENTS.FETCH_DETAIL_FAILED,
      500
    );
  }

  return successResponse(
    data as unknown as DepartmentDetail,
    MESSAGES.DEPARTMENTS.FETCH_SUCCESS
  );
};
