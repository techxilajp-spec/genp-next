export interface DepartmentSummaryResponse {
  success: boolean;
  message: string;
  data: DepartmentSummary;
}

export interface DepartmentSummary {
  total_departments: number;
  total_employees: number;
  avg_employees_per_department: number;
  total_budget: number;
}

export interface DepartmentsResponse {
  success: boolean;
  message: string;
  data: {
    data: Department[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface Department {
  department_id: string;
  department_name: string;
  description: string;
  code: string;
  manager_id: string;
  manager_name: string;
  employee_count: number;
  budget: number;
  level: "executive" | "management" | "operational" | "support";
  location: string;
  phone: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  status: boolean;
  department_completion_percentage: number;
  department_productivity_percentage: number;
}

export interface DepartmentUpdate {
  department_id: string;
  department_name: string;
  description: string;
  code: string;
  manager_id: string;
  budget: number;
  level: string;
  location: string;
  phone: string;
  email: string;
  status: boolean;
}

export interface DepartmentCreate {
  department_name: string;
  description: string;
  code: string;
  manager_id: string;
  budget: number;
  level: string;
  location: string;
  phone: string;
  email: string;
  status: boolean;
}

export interface DepartmentDetailResponse {
  success: boolean;
  message: string;
  data: DepartmentDetail;
}

export interface DepartmentDetail {
  department_id: string;
  department_name: string;
  code: string;
  description: string;
  manager_id: string;
  manager_name: string;
  level: "executive" | "management" | "operational" | "support";
  budget: number;
  location: string;
  phone: string;
  email: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
  employees: DepartmentEmployee[];
}

export interface DepartmentEmployee {
  user_id: string;
  username: string;
  email: string;
  role: string;
  joined_at: string;
}

export interface DepartmentEmployees {
  user_id: string;
  username: string;
  email: string;
  department_users: {
    department_id: string;
  }[];
}
