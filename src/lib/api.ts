/**
 * api.ts - Django REST API client wrapper
 * Replaces direct Supabase queries.
 */

const API_URL = (import.meta as any).env.VITE_API_URL || '';

// Token storage (in-memory)
let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
}

interface RequestOptions extends RequestInit {
  data?: any;
}

async function apiRequest<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...restOptions } = options;
  
  const url = `${API_URL}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const reqHeaders: Record<string, string> = {
    'Accept': 'application/json',
    ...(headers as Record<string, string> || {}),
  };
  
  if (data instanceof FormData) {
    // Let browser set Content-Type for FormData
  } else if (data) {
    reqHeaders['Content-Type'] = 'application/json';
  }
  
  if (authToken) {
    reqHeaders['Authorization'] = `Bearer ${authToken}`;
  }
  
  const body = data && !(data instanceof FormData) ? JSON.stringify(data) : data;
  
  const response = await fetch(url, {
    ...restOptions,
    headers: reqHeaders,
    body,
  });
  
  let result;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    result = await response.json();
  } else {
    result = await response.text();
  }
  
  if (!response.ok) {
    throw new Error((result && result.error) || response.statusText || 'API Error');
  }
  
  return result;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T = any>(endpoint: string, data?: any, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'POST', data }),
    
  put: <T = any>(endpoint: string, data?: any, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'PUT', data }),
    
  patch: <T = any>(endpoint: string, data?: any, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', data }),
    
  delete: <T = any>(endpoint: string, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
