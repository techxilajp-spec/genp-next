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