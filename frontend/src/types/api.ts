// Define the standardized API envelope types following Constitution v2.0.0
export interface ApiResponseSuccess<T = any> {
  status: 'success';
  data: T;
  meta: {
    timestamp: string;
    request_id: string;
  };
}

export interface ApiResponseError {
  status: 'error';
  error: {
    code: string;
    message: string;
    details?: any[];
  };
  meta: {
    timestamp: string;
    request_id: string;
  };
}

export type ApiResponse<T = any> = ApiResponseSuccess<T> | ApiResponseError;

// Generic interface for API responses
export interface APIResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  meta?: {
    timestamp: string;
    request_id: string;
  };
}

// Request and response interfaces for common operations
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}