"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { TaskCategoryUpdate } from "@/types/api/admin/categories/task";

/**
 * @swagger
 * /api/admin/categories/task/{id}/update:
 *   patch:
 *     tags:
 *       - Task Categories
 *     summary: Update a task category
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
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category_id:
 *                   type: integer
 *                   description: ID of the updated category
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
export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> => {
  const supabase = await createClient();
  const categoryId = Number((await params).id);
  const { name, description, color } = await req.json();

  // 1. Check if category ID is provided
  if (!categoryId) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      MESSAGES.CATEGORIES.TASK.ID_REQUIRED,
      500
    );
  }

  // 2. Update category
  const { data, error } = await supabase.from("task_categories").update({
    name,
    description,
    color,
    is_active: true,
  }).eq("category_id", categoryId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.TASK.UPDATE_FAILED,
      500
    );
  }

  // 3. Return success response
  return successResponse(
    {
      data,
    } as unknown as TaskCategoryUpdate,
    MESSAGES.CATEGORIES.TASK.UPDATE_SUCCESS
  );
};
