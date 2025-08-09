"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { FinancialCategory } from "@/types/api/admin/categories/financial";

/**
 * @swagger
 * /api/admin/categories/financial/{id}:
 *   get:
 *     tags:
 *       - Financial Categories
 *     summary: Get a financial category by ID
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
 *                     category_type:
 *                       type: string
 *                     is_active:
 *                       type: boolean
 *             example:
 *               success: true
 *               message: "Financial category fetched successfully"
 *               data:
 *                 category_id: 1
 *                 name: "Development"
 *                 description: "Tasks related to software development"
 *                 category_type: "income"
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
 *                 error: "Financial category not found"
 */
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const supabase = await createClient();
  const categoryId = Number((await params).id);

  const { data, error } = await supabase
    .from("financial_categories")
    .select(
      `
        category_id,
        name,
        description,
        category_type,
        is_active
    `
    )
    .eq("category_id", categoryId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.FINANCIAL.FETCH_FAILED,
      500
    );
  }

  return successResponse(
    {
      category_id: data[0].category_id,
      name: data[0].name,
      description: data[0].description,
      category_type: data[0].category_type,
      is_active: data[0].is_active,
    } as unknown as FinancialCategory,
    MESSAGES.CATEGORIES.FINANCIAL.FETCH_SUCCESS
  );
};
