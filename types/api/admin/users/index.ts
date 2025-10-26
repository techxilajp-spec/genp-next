export interface UsersNamesResponse {
  data: {
    user_id: string;
    username: string;
  }[];
}

export interface UserProductivity {
  user_id: string;
  username: string;
  email: string;
  user_photo: string;
  phone_number: string;
  registration_date: string;
  last_login: string;
  user_type: string;
  is_active: boolean;
  tasks_completed_today: number;
  tasks_completed_week: number;
  tasks_completed_month: number;
  completion_percentage: number;
  productivity_score: number;
  department: string;
}

export interface UserTasksDetailResponse {
  success: boolean;
  message: string;
  data: UserTaskDetail[];
}

export interface UserTaskDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  completed_at: string;
  duration_minutes: number;
  priority: "low" | "medium" | "high";
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "in_progress" | "completed" | "overdue";
  productivityScore: number;
  completionRate: number;
}

export interface UsertaskData {
  user_id: string;
  username: string;
  email: string;
  user_photo: string;
  tasks_completed_today: number;
  tasks_completed_week: number;
  tasks_completed_month: number;
  avg_completion_rate: number;
  productivity_score: number;
}
