export interface TaskCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    data: TaskCategory[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface TaskCategory {
  category_id: number;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  tasks: {
    count: number;
  }[];
}

export interface TaskCategoryCreate {
  name: string;
  description: string;
  color: string;
}

export interface TaskCategoryUpdate {
  category_id: number;
  name: string;
  description: string;
  color: string;
}

export interface TaskCategoryDelete {
  category_id: number;
}
