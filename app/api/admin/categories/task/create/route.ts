"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { TaskCategoryCreate } from "@/types/api/admin/categories/task";

/**
 * @swagger
 * /api/admin/categories/task/create:
 *   post:
 *     tags:
 *       - Task Categories
 *     summary: Create a new task category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               color:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *             example:
 *               name: "Development"
 *               description: "Tasks related to software development"
 *               color: "#3B82F6"
 *               is_active: true
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: integer
 *                   description: ID of the created category
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 color:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 *               example:
 *                 category_id: 1
 *                 name: "Development"
 *                 description: "Tasks related to software development"
 *                 color: "#3B82F6"
 *                 is_active: true
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
  const { name, description, color } = await req.json();

  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      MESSAGES.CATEGORIES.TASK.CREATE_FAILED,
      500
    );
  }

  const { data, error } = await supabase.from("task_categories").insert({
    name,
    description,
    color,
    is_active: true,
    created_by: user?.user?.id,
  });

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.TASK.CREATE_FAILED,
      500
    );
  }

  return successResponse(
    {
      data,
    } as unknown as TaskCategoryCreate,
    MESSAGES.CATEGORIES.TASK.CREATE_SUCCESS
  );
};
