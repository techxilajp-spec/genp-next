"use server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { UserCreate } from "@/types/api/admin/users";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest): Promise<Response> => {
  const supabase = await createClient();
  const { username, email, phone_number, user_type, department } =
    await req.json();

  const { data, error } = await supabase.from("users").insert({
    username: username,
    email: email,
    phone_number: phone_number,
    user_type: user_type,
    department: department,
  });

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.USERS.CREATE_FAILED,
      500
    );
  }

  return successResponse(
    {
      data,
    } as unknown as UserCreate,
    MESSAGES.USERS.CREATE_SUCCESS
  );
};
