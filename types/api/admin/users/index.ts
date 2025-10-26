export interface UsersNamesResponse {
  data: {
    user_id: string;
    username: string;
  }[];
}

export interface UserDepartmentResponse {
  data: {
    department_id: string;
    name: string;
  }[];
}

export interface Users {
  user_id: string;
  username: string;
  email: string;
  phone_number: string;
  user_photo: string;
  user_type: "admin" | "member";
  department: string;
  is_active: boolean;
  account_status: string;
  email_verified: boolean;
  phone_verified: boolean;
  two_factor_enabled: boolean;
  registration_date: string;
  last_login: string;
  last_password_change: string;
  login_attempts: number;
  is_locked: boolean;
  locked_until: string | null;
  user_deactivation_history: UserDeactivationHistory | null;
  role_permissions: string;
}

export interface UserUpdate {
  user_id: string;
  username: string;
  email: string;
  phone_number: string;
  user_type: string;
  department_id: string;
  email_verified: boolean;
  phone_verified: boolean;
  two_factor_enabled: boolean;
  role_permissions: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    data: Users[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface UserDeactivationHistory {
  reason: string | null;
  performed_by: string | null;
  performed_at: string | null;
}

export interface UserCreate {
  username: string;
  email: string;
  phone_number: string;
  user_type: string;
  department: string;
  password: string;
  role_permissions: string;
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
