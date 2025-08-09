"use server";

import { createClient } from "@/utils/supabase/server";
import { successResponse, errorResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";

/**
 * POST LOGIN API
 * @param req - request object
 * @returns response object
 * @author Yan Naing Htwe
 */
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  /**
   * User not found
   */
  if (error || !data.user) {
    return errorResponse(
      error?.message || MESSAGES.AUTH.LOGIN_FAILED,
      MESSAGES.AUTH.LOGIN_FAILED,
      401
    );
  }

  const { data: user } = await supabase
    .from("users")
    .select("user_type, is_active")
    .eq("user_id", data.user.id)
    .single();

  /**
   * Account is inactive
   */
  if (user?.is_active === false) {
    return errorResponse(
      MESSAGES.AUTH.ACCOUNT_INACTIVE,
      MESSAGES.AUTH.ACCOUNT_INACTIVE,
      401
    );
  }

  const { error: userError } = await supabase
    .from("users")
    .update({
      last_login: new Date(),
    })
    .eq("user_id", data.user.id);

  if (userError) {
    return errorResponse(
      MESSAGES.COMMON.UNEXPECTED_ERROR,
      MESSAGES.COMMON.UNEXPECTED_ERROR,
      500
    );
  }

  return successResponse(
    {
      userId: data.user.id,
    },
    MESSAGES.AUTH.LOGIN_SUCCESS
  );
}
