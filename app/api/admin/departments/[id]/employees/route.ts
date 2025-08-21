"use server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";
import { DepartmentEmployees } from "@/types/api/admin/departments";

/**
 * @swagger
 * /api/admin/departments/{id}/employees:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get a department employees to select
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       department_users:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             department_id:
 *                               type: string
 *             example:
 *               success: true
 *               message: "Department fetched successfully"
 *               data:
 *                 user_id: "1"
 *                 username: "John Doe"
 *                 email: "john.doe@example.com"
 *                 department_users: [
 *                   {
 *                     department_id: "1"
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
    .from("users")
    .select("user_id, username, email, department_users!inner(department_id)")
    .neq("department_users.department_id", departmentId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.DEPARTMENTS.FETCH_DETAIL_FAILED,
      500
    );
  }

  return successResponse(
    data as unknown as DepartmentEmployees,
    MESSAGES.DEPARTMENTS.FETCH_DETAIL_SUCCESS
  );
};
