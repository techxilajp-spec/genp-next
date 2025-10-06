"use server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { UserCreate } from "@/types/api/admin/users";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import crypto from "crypto"; // built-in Node.js module

// Generate passowrd for create auth user
function generatePassword(length = 12) {
  //Generate random string with upper/lowercase, numbers, and symbols
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join("");
}

export const POST = async (req: NextRequest): Promise<Response> => {
  const supabase = await createClient();
  const { username, email, phone_number, user_type, department, password } =
    await req.json();
  try {
    const finalPassword = password || generatePassword(14);

    // create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: finalPassword,
        email_confirm: true,
      });

    if (authError) {
      console.error("Auth Error: ", authError);
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        authError.message || "Failed to create auth user",
        500
      );
    }

    const authUserId = authData.user.id;
    if (!authUserId) {
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        "Auth user Id not returned",
        500
      );
    }

    // Get department name by department id
    const { data: department_name, error: departError } = await supabase
      .from("departments")
      .select("name")
      .eq("department_id", department)
      .single();

    if (departError) {
      console.error("API Error :", departError);
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        departError?.message || MESSAGES.DEPARTMENTS.FETCH_FAILED,
        500
      );
    }

    // Create user
    const { data, error } = await supabase
      .from("users")
      .insert({
        user_id: authUserId,
        username: username,
        email: email,
        phone_number: phone_number,
        user_type: user_type,
        department: department_name.name,
      })
      .select()
      .single();

    if (error) {
      console.error("API Error:", error);
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        error.message || MESSAGES.USERS.CREATE_FAILED,
        500
      );
    }

    // Create department-user
    const { error: mapError } = await supabase.from("department_users").insert({
      user_id: authUserId,
      department_id: department,
    });

    if (mapError) {
      console.error("API Error (mapping):", mapError);
      return errorResponse(
        MESSAGES.COMMON.ERROR,
        mapError.message || MESSAGES.USERS.CREATE_FAILED,
        500
      );
    }

    return successResponse(
      {
        data,
      } as unknown as UserCreate,
      MESSAGES.USERS.CREATE_SUCCESS
    );
  } catch (err: any) {
    console.error("Unexpected API Error:", err);
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      err.message || "Unexpected server error",
      500
    );
  }
};
