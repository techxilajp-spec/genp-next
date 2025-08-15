"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { FinancialCategoryCreate } from "@/types/api/admin/categories/financial";

/**
 * @swagger
 * /api/admin/categories/financial/create:
 *   post:
 *     tags:
 *       - Financial Categories
 *     summary: Create a new financial category
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
 *               category_type:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *             example:
 *               name: "Development"
 *               description: "Tasks related to software development"
 *               category_type: "income"
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
 *                 category_type:
 *                   type: string
 *                 is_active:
 *                   type: boolean
 *               example:
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
 *                 error: "Invalid data provided"
 */
export const POST = async (req: NextRequest): Promise<Response> => {
  const supabase = await createClient();
  const { name, description, category_type } = await req.json();

  const { data: user } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      MESSAGES.CATEGORIES.FINANCIAL.CREATE_FAILED,
      500
    );
  }

  const { data, error } = await supabase.from("financial_categories").insert({
    name,
    description,
    category_type,
    is_active: true,
    created_by: user?.user?.id,
  });

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.CATEGORIES.FINANCIAL.CREATE_FAILED,
      500
    );
  }

  return successResponse(
    {
      data,
    } as unknown as FinancialCategoryCreate,
    MESSAGES.CATEGORIES.FINANCIAL.CREATE_SUCCESS
  );
};
