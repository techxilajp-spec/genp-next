import { errorResponse, successResponse } from "@/lib/api/response";
import { UserDepartmentResponse } from "@/types/api/admin/users";
import { MESSAGES } from "@/types/messages";
import { createClient } from "@/utils/supabase/server";

export const GET = async (): Promise<Response> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("department_id, name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      error.message || MESSAGES.DEPARTMENTS.FETCH_FAILED,
      500
    );
  }

  return successResponse(
    data as unknown as UserDepartmentResponse,
    MESSAGES.DEPARTMENTS.FETCH_SUCCESS
  );
};
