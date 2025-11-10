/**
 * @type ApiResponse
 * @summary Standard API response structure.
 * @domain core
 * @category types
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * @type ApiError
 * @summary Standard API error structure.
 * @domain core
 * @category types
 */
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
