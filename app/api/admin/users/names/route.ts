"use server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { UserProductivity, UsersNamesResponse } from "@/types/api/admin/users";

/**
 * @swagger
 * /api/admin/users/names:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get users
 *     description: Returns a list of users.
 *     responses:
 *       200:
 *         description: A list of users
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
 *       500:
 *         description: Internal server error
 */
export const GET = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("user_id, username")
    .order("created_at", { ascending: false });

  const { data: userProductivity, error: userProductivityError } =
  await supabase
    .from("user_productivity_v")
    .select(`
      user_id, username, email, phone_number, registration_date, last_login,
      user_type, is_active, department,
      tasks_completed_today, tasks_completed_week, tasks_completed_month,
      completion_percentage, productivity_score
    `)
    .order("registration_date", { ascending: false });

  if (error || userProductivityError) {
    return errorResponse(
      MESSAGES.USERS.FETCH_FAILED,
      error?.message ||
        userProductivityError?.message ||
        MESSAGES.COMMON.UNEXPECTED_ERROR,
      500
    );
  }
  return successResponse(
    userProductivity as unknown as UserProductivity,
    MESSAGES.USERS.FETCH_SUCCESS
  );
};
