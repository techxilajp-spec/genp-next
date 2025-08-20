"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { DepartmentUpdate } from "@/types/api/admin/departments";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/admin/departments/{id}/update:
 *   patch:
 *     tags:
 *       - Departments
 *     summary: Update a department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department_name:
 *                 type: string
 *               description:
 *                 type: string
 *               manager_id:
 *                 type: string
 *               level:
 *                 type: string
 *               budget:
 *                 type: number
 *               location:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               department_name: "Development"
 *               description: "Tasks related to software development"
 *               manager_id: 1
 *               level: "executive"
 *               budget: 100000
 *               location: "New York"
 *               phone: "1234567890"
 *               email: "development@example.com"
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 department_id:
 *                   type: integer
 *                   description: ID of the updated department
 *                 department_name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 manager_id:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 *               example:
 *                 department_id: 1
 *                 department_name: "Development"
 *                 description: "Tasks related to software development"
 *                 manager_id: 1
 *                 level: "executive"
 *                 budget: 100000
 *                 location: "New York"
 *                 phone: "1234567890"
 *                 email: "development@example.com"
 *                 created_at: "2023-01-01T00:00:00.000Z"
 *                 updated_at: "2023-01-01T00:00:00.000Z"
 *                 status: true
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
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> => {
  const supabase = await createClient();
  const departmentId = String((await params).id);
  const {
    department_name,
    description,
    manager_id,
    code,
    level,
    budget,
    location,
    phone,
    email,
  } = await req.json();

  // 1. Check if category ID is provided
  if (!departmentId) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      MESSAGES.DEPARTMENTS.ID_REQUIRED,
      500
    );
  }

  // 2. Update category
  const { data, error } = await supabase
    .from("departments")
    .update({
      name: department_name,
      description,
      manager_id,
      code,
      level,
      budget,
      location,
      phone,
      email,
    })
    .eq("department_id", departmentId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.DEPARTMENTS.UPDATE_FAILED,
      500
    );
  }

  // 3. Return success response
  return successResponse(
    {
      data,
    } as unknown as DepartmentUpdate,
    MESSAGES.DEPARTMENTS.UPDATE_SUCCESS
  );
};
