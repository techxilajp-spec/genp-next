"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { TaskCategory } from "@/types/api/admin/categories/task";

/**
 * @swagger
 * /api/admin/categories/task/{id}:
 *   get:
 *     tags:
 *       - Task Categories
 *     summary: Get a task category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the task category
 *     responses:
 *       200:
 *         description: Task category fetched successfully
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
 *                     category_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     color:
 *                       type: string
 *                     is_active:
 *                       type: boolean
 *             example:
 *               success: true
 *               message: "Task category fetched successfully"
 *               data:
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
 *                 error: "Task category not found"
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const categoryId = Number((await params).id);

  const { data, error } = await supabase
    .from("task_categories")
    .select(
      `
        category_id,
        name,
        description,
        color,
        is_active
    `
    )
    .eq("category_id", categoryId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.TASK.FETCH_FAILED,
      500
    );
  }

  return successResponse(
    {
      category_id: data[0].category_id,
      name: data[0].name,
      description: data[0].description,
      color: data[0].color,
      is_active: data[0].is_active,
    } as unknown as TaskCategory,
    MESSAGES.CATEGORIES.TASK.FETCH_SUCCESS
  );
};
