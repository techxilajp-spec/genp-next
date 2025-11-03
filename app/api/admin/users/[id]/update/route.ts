"use server";

import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
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
    role_permissions,
  } = await req.json();

  // Check if user Id is provided
  if (!userId) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      MESSAGES.USERS.ID_REQUIRED,
      500
    );
  }

  // Get department name by department id
  const { data: department_name, error: departError } = await supabase
    .from("departments")
    .select("name")
    .eq("department_id", department_id)
    .single();

  if (departError) {
    console.error("API Error :", departError);
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      departError?.message || MESSAGES.DEPARTMENTS.FETCH_FAILED,
      500
    );
  }

  // 2.Update user
  const { data, error } = await supabase
    .from("users")
    .update({
      username: username,
      email: email,
      phone_number: phone_number,
      user_type: user_type,
      department: department_name.name,
      email_verified: email_verified,
      phone_verified: phone_verified,
      two_factor_enabled: two_factor_enabled,
    })
    .eq("user_id", userId);

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.USERS.UPDATE_FAILED,
      500
    );
  }

  //Update Permission
  const { error: updateRoleError } = await supabase
    .from("user_permissions")
    .update({
      permission_name: role_permissions,
      granted_by: null,
    })
    .eq("user_id", userId);

  if (updateRoleError) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      updateRoleError.message || MESSAGES.USERS.UPDATE_FAILED,
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
