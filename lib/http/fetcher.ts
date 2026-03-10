import type { ApiResponse } from '@/types/domain';

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || body.error) {
    throw new Error(body.error?.message ?? 'API error');
  }
  return body.data as T;
}
