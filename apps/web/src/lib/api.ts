const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface ApiErrorBody {
  message: string;
  errors?: unknown;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({ message: "خطای غیرمنتظره" }))) as ApiErrorBody;
    throw new Error(body.message);
  }

  return response.json() as Promise<T>;
}
