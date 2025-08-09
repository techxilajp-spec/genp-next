/**
 * API response type
 * @author Yan Naing Htwe
 */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};
