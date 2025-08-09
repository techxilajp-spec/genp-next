"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { TaskCategoryDelete } from "@/types/api/admin/categories/task";

/**
 * @swagger
 * /api/admin/categories/task/{id}/delete:
 *   delete:
 *     tags:
 *       - Task Categories
 *     summary: Delete a task category
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the task category
 *     responses:
 *       200:
 *         description: Deleted successfully
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
 *                       description: ID of the deleted category
 *                 example:
 *                   success: true
 *                   message: "Task category deleted successfully"
 *                   data:
 *                     category_id: 1
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
export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const categoryId = Number((await params).id);

  // 1. Check if category ID is provided
  if (!categoryId) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      MESSAGES.CATEGORIES.TASK.ID_REQUIRED,
      500
    );
  }

  // 2. Check if category is in use
  const { data: isCategoryExists, error: isCategoryExistsError } =
    await supabase
      .from("tasks")
      .select("category_id")
      .eq("category_id", categoryId);

  if (isCategoryExistsError) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      isCategoryExistsError.message || MESSAGES.CATEGORIES.TASK.DELETE_FAILED,
      500
    );
  }

  if (isCategoryExists.length > 0) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      MESSAGES.CATEGORIES.TASK.CATEGORY_IN_USE,
      500
    );
  }

  // 3. Delete category
  const { data, error } = await supabase
    .from("task_categories")
    .delete()
    .eq("category_id", categoryId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.TASK.DELETE_FAILED,
      500
    );
  }

  // 4. Return success response
  return successResponse(
    {
      data,
    } as unknown as TaskCategoryDelete,
    MESSAGES.CATEGORIES.TASK.DELETE_SUCCESS
  );
};
