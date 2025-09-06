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
  user_type: string;
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
  role_permissions: string[];
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
}
