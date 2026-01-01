import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { ApiResponse } from '@/types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Generic API hook for making requests with loading and error states
export const useApi = <T,>(
  url: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: any;
    skip?: boolean; // If true, skip the request
    headers?: Record<string, string>;
  }
): UseApiState<T> & {
  refetch: () => Promise<void>;
} => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: !options?.skip,
    error: null,
  });

  const fetchData = useCallback(async () => {
    if (options?.skip) {
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let response;
      const method = options?.method || 'GET';

      switch (method) {
        case 'GET':
          response = await apiClient.get<ApiResponse<T>>(url);
          break;
        case 'POST':
          response = await apiClient.post<ApiResponse<T>>(url, options.body);
          break;
        case 'PUT':
          response = await apiClient.put<ApiResponse<T>>(url, options.body);
          break;
        case 'PATCH':
          response = await apiClient.patch<ApiResponse<T>>(url, options.body);
          break;
        case 'DELETE':
          response = await apiClient.delete<ApiResponse<T>>(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      // The response interceptor already extracts the data from the envelope
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setState({
        data: null,
        loading: false,
        error: error.message || 'API request failed',
      });
    }
  }, [url, options?.skip, options?.method, options?.body, JSON.stringify(options?.headers)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
};

// Specific hooks for common operations
export const useGet = <T,>(url: string, skip: boolean = false) =>
  useApi<T>(url, { method: 'GET', skip });

export const usePost = <T,>(url: string, body: any) =>
  useApi<T>(url, { method: 'POST', body });

export const usePut = <T,>(url: string, body: any) =>
  useApi<T>(url, { method: 'PUT', body });

export const usePatch = <T,>(url: string, body: any) =>
  useApi<T>(url, { method: 'PATCH', body });

export const useDelete = <T,>(url: string) =>
  useApi<T>(url, { method: 'DELETE' });