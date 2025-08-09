"use server";

import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";

/**
 * GET USER API
 * @returns
 * @author ヤン
 */
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return errorResponse(
      error?.message || MESSAGES.COMMON.UNEXPECTED_ERROR,
      MESSAGES.COMMON.UNEXPECTED_ERROR,
      500
    );
  }

  return successResponse(data, MESSAGES.COMMON.SUCCESS);
}
