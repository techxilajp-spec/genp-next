"use server";

import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * POST RESET PASSWORD API
 * @param req - request object
 * @returns response object
 * @author Yan Naing Htwe
 */
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  /**
   * Email is required
   */
  if (!email) {
    return errorResponse(
      MESSAGES.AUTH.EMAIL_REQUIRED,
      MESSAGES.AUTH.EMAIL_REQUIRED,
      405
    );
  }

  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!user) {
    return errorResponse(
      MESSAGES.AUTH.USER_NOT_AUTHENTICATED,
      MESSAGES.AUTH.USER_NOT_AUTHENTICATED,
      401
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/change-password`,
  });

  /**
   * Password reset failed
   */
  if (error) {
    return errorResponse(
      error?.message || MESSAGES.AUTH.RESET_PASSWORD_FAILED,
      MESSAGES.AUTH.RESET_PASSWORD_FAILED,
      400
    );
  }

  return successResponse({}, MESSAGES.AUTH.RESET_PASSWORD_EMAIL_SENT);
}
