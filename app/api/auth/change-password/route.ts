"use server";

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * POST CHANGE PASSWORD API
 * @param req - request object
 * @returns response object
 * @author Yan Naing Htwe
 */
export async function POST(req: NextRequest) {
  const { password, confirmPassword } = await req.json();

  /**
   * Password is required
   */
  if (!password || !confirmPassword) {
    return errorResponse(
      MESSAGES.AUTH.PASSWORD_REQUIRED,
      MESSAGES.AUTH.PASSWORD_REQUIRED,
      400
    );
  }

  /**
   * Password does not match
   */
  if (password !== confirmPassword) {
    return errorResponse(
      MESSAGES.AUTH.PASSWORD_MATCH,
      MESSAGES.AUTH.PASSWORD_MATCH,
      400
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  /**
   * Password change failed
   */
  if (error) {
    return errorResponse(
      error?.message || MESSAGES.AUTH.CHANGE_PASSWORD_FAILED,
      MESSAGES.AUTH.CHANGE_PASSWORD_FAILED,
      400
    );
  }

  return successResponse({}, MESSAGES.AUTH.CHANGE_PASSWORD_SUCCESS);
}
