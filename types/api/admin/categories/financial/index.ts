export interface FinancialCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    data: FinancialCategory[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface FinancialCategory {
  category_id: number;
  name: string;
  description: string;
  is_active: boolean;
  category_type: string;
  financial_records: {
    count: number;
  }[];
}

export interface FinancialCategoryCreate {
  name: string;
  description: string;
  is_active: boolean;
  category_type: string;
}

export interface FinancialCategoryUpdate {
  category_id: number;
  name: string;
  description: string;
  is_active: boolean;
  category_type: string;
}

export interface FinancialCategoryDelete {
  category_id: number;
}
