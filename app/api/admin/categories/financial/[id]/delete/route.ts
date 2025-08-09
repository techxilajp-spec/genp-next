"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { FinancialCategoryDelete } from "@/types/api/admin/categories/financial";

/**
 * @swagger
 * /api/admin/categories/financial/{id}/delete:
 *   delete:
 *     tags:
 *       - Financial Categories
 *     summary: Delete a financial category
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
 *                   message: "Financial category deleted successfully"
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
 *                 error: "Financial category not found"
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
      MESSAGES.CATEGORIES.FINANCIAL.ID_REQUIRED,
      500
    );
  }

  // 2. Delete category
  const { data, error } = await supabase
    .from("financial_categories")
    .delete()
    .eq("category_id", categoryId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.FINANCIAL.DELETE_FAILED,
      500
    );
  }

  // 3. Return success response
  return successResponse(
    {
      data,
    } as unknown as FinancialCategoryDelete,
    MESSAGES.CATEGORIES.FINANCIAL.DELETE_SUCCESS
  );
};
