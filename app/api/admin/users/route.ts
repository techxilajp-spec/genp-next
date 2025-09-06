"use server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { Users, UserResponse } from "@/types/api/admin/users";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/admin/users/{id}/users:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get a user to select
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User fetched successfully
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
 *                       user_photo:
 *                         type: string
 *                       phone_number:
 *                         type: string
 *                       registration_date:
 *                         type: string
 *                       last_login:
 *                         type: string
 *                       user_type:
 *                         type: string
 *                       is_active:
 *                         type: boolean
 *                       account_status:
 *                         type: string
 *                       deactivation_reason:
 *                         type: string
 *                       deactivated_at:
 *                         type: string
 *                       deactivated_by:
 *                         type: string
 *                       login_attempts:
 *                         type: number
 *                       is_locked:
 *                         type: boolean
 *                       locked_until:
 *                         type: string
 *                       email_verified:
 *                         type: boolean
 *                       phone_verified:
 *                         type: boolean
 *                       two_factor_enabled:
 *                         type: boolean
 *                       last_password_change:
 *                         type: string
 *                       department:
 *                         type: string
 *             example:
 *               success: true
 *               message: "User fetched successfully"
 *               data:
 *                 user_id: "1"
 *                 username: "John Doe"
 *                 email: "john.doe@example.com"
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
 *                 error: "User not found"
 */
export const GET = async (req: NextRequest): Promise<Response> => {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const keyword = searchParams.get("keyword") ?? "";
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("user_with_deactivate_history")
    .select("*", { count: "exact" })
    .ilike("username", `%${keyword}%`)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.USERS.FETCH_FAILED,
      500
    );
  }

  return successResponse(
    {
      data,
      total: count ?? 0,
      page,
      pageSize,
    } as unknown as UserResponse,
    MESSAGES.USERS.FETCH_SUCCESS
  );
};
