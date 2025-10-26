import { createClient } from "@/utils/supabase/server";
import { errorResponse, successResponse } from "@/lib/api/response";
import { MESSAGES } from "@/types/messages";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  const { userId } = await params;
  const supabase = await createClient();

  const { data: tasksData, error: tasksError } = await supabase
    .from("tasks")
    .select(
      `
      task_id,
      title,
      description,
      completed_at,
      actual_duration,
      priority,
      difficulty,
      status,
      created_at,
      updated_at,
      users:user_id ( user_id, username, email ),
      task_categories:category_id ( category_id, name )
    `
    )
    .eq("user_id", userId)
    .eq("status", "completed"); 


  const { data: prodData, error: prodError } = await supabase
    .from("user_productivity_v")
    .select("completion_percentage, productivity_score")
    .eq("user_id", userId)
    .single();

  if (tasksError || prodError) {
    console.error("tasksError:", tasksError, "prodError:", prodError);
    return errorResponse(
      MESSAGES.COMMON.ERROR,
      tasksError?.message || prodError?.message || MESSAGES.TASKS.FETCH_FAILED,
      500
    );
  }

  // 3) Map tasks and include username/email/category and productivity values
  const mapped = (tasksData ?? []).map((task: any) => ({
    id: task.task_id,
    title: task.title,
    userName: task.users?.username ?? "Unknown User",
    email: task.users?.email ?? "No Email",
    description: task.description,
    category: task.task_categories?.name ?? "Uncategorized",
    completed_at: task.completed_at,
    duration_minutes: task.actual_duration,
    priority: task.priority,
    difficulty: task.difficulty,
    status: task.status,
    // attach view-level values (same for all tasks of this user)
    productivityScore: prodData?.productivity_score ?? null,
    completionRate: prodData?.completion_percentage ?? null,
  }));

  return successResponse(mapped, MESSAGES.TASKS.FETCH_SUCCESS);
};
