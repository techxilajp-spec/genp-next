"use server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { UsersNamesResponse } from "@/types/api/admin/users";

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

  if (error) {
    return errorResponse(
      MESSAGES.USERS.FETCH_FAILED,
      error.message || MESSAGES.COMMON.UNEXPECTED_ERROR,
      500
    );
  }
  return successResponse(
    data as unknown as UsersNamesResponse,
    MESSAGES.USERS.FETCH_SUCCESS
  );
};
