"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { UserUpdate } from "@/types/api/admin/users";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> => {
  const supabase = await createClient();
  const userId = String((await params).id);
  const {
    username,
    email,
    phone_number,
    department_id,
    email_verified,
    phone_verified,
    two_factor_enabled,
    user_type,
    role_permission,
  } = await req.json();

  // Check if user Id is provided
  if (!userId) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      MESSAGES.USERS.ID_REQUIRED,
      500
    );
  }

  // 2.Update user
  const { data, error } = await supabase
    .from("users")
    .update({
      username,
      email,
      phone_number,
      user_type,
      department_id,
      email_verified,
      phone_verified,
      two_factor_enabled,
    })
    .eq("user_id", userId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.USERS.UPDATE_FAILED,
      500
    );
  }

  console.log("Successfully update");
  // Return success response
  return successResponse(
    {
      data,
    } as unknown as UserUpdate,
    MESSAGES.USERS.UPDATE_SUCCESS
  );
};
