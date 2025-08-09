import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api/api-response";

/**
 * This function returns a success response.
 * @param data - The data to be returned.
 * @param message - The message to be returned.
 * @param status - HTTP status code.
 * @returns Success response.
 * @author Yan Naing Htwe
 */
export const successResponse = <T>(
  data: T,
  message: string = "Success",
  status = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return NextResponse.json(response, { status });
};

/**
 * This function returns an error response.
 * @param error - The error message to be returned.
 * @param message - The message to be returned.
 * @param status - HTTP status code.
 * @returns Error response.
 * @author Yan Naing Htwe
 */
export const errorResponse = (
  error: string,
  message: string = "Error",
  status = 400
) => {
  const response: ApiResponse<null> = {
    success: false,
    message,
    error,
  };
  return NextResponse.json(response, { status });
};
