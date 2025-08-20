"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { DepartmentCreate } from "@/types/api/admin/departments";

/**
 * @swagger
 * /api/admin/departments/create:
 *   post:
 *     tags:
 *       - Departments
 *     summary: Create a new department
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
 *               code:
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
 *               manager_id: "1"
 *               code: "DEV"
 *               level: "executive"
 *               budget: 100000
 *               location: "New York"
 *               phone: "1234567890"
 *               email: "development@example.com"
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 department_id:
 *                   type: integer
 *                   description: ID of the created department
 *                 department_name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 manager_id:
 *                   type: string
 *                 code:
 *                   type: string
 *                 level:
 *                   type: string
 *                 budget:
 *                   type: number
 *                 location:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 email:
 *                   type: string
 *               example:
 *                 department_id: 1
 *                 department_name: "Development"
 *                 description: "Tasks related to software development"
 *                 manager_id: "1"
 *                 code: "DEV"
 *                 level: "executive"
 *                 budget: 100000
 *                 location: "New York"
 *                 phone: "1234567890"
 *                 email: "development@example.com"
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
export const POST = async (req: NextRequest): Promise<Response> => {
  const supabase = await createClient();
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

  const { data, error } = await supabase.from("departments").insert({
    name: department_name,
    description,
    manager_id,
    code,
    level,
    budget,
    location,
    phone,
    email,
  });

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.DEPARTMENTS.CREATE_FAILED,
      500
    );
  }

  return successResponse(
    {
      data,
    } as unknown as DepartmentCreate,
    MESSAGES.DEPARTMENTS.CREATE_SUCCESS
  );
};
