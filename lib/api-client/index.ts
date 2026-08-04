import { getSession } from 'next-auth/react';
import { AppError } from '../shared/errors';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  data?: any;
}

export class ApiClient {
  private baseUrl = '/api';

  private async getHeaders(): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // For client-side fetching, cookies are automatically sent.
    // However, if we were using custom tokens, we could inject them here.
    return headers;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const message = data?.message || response.statusText;
      const code = data?.code || 'UNKNOWN_ERROR';
      
      throw new AppError(message, response.status, code, data?.errors);
    }

    // Assuming our API always returns `{ success, message, data, meta }`
    return data.data as T;
  }

  async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: { ...headers, ...options.headers },
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    
    // Don't set Content-Type if sending FormData (browser handles it and sets correct boundary)
    const isFormData = options.data instanceof FormData;
    const headers = await this.getHeaders();
    if (isFormData) {
      delete (headers as Record<string, string>)['Content-Type'];
    }

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: { ...headers, ...options.headers },
      body: isFormData ? options.data : JSON.stringify(options.data),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      ...options,
      method: 'PATCH',
      headers: { ...headers, ...options.headers },
      body: JSON.stringify(options.data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = this.buildUrl(endpoint, options.params);
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: { ...headers, ...options.headers },
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
