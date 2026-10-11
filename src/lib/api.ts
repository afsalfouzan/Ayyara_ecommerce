/** Backend base URL. Server code may use a private URL; the browser uses the public one. */
export const API_URL = (
  typeof window === 'undefined' ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL) : process.env.NEXT_PUBLIC_API_URL
)?.replace(/\/$/, '') ?? 'http://localhost:4000/api/v1';

export class StoreApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export async function storeApi<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { Accept: 'application/json', ...(init?.json !== undefined ? { 'Content-Type': 'application/json' } : {}), ...init?.headers },
      body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
    });
  } catch {
    throw new StoreApiError(0, 'NETWORK_ERROR', 'We couldn’t reach our servers. Please check your connection and try again.');
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = payload?.error;
    throw new StoreApiError(response.status, error?.code ?? 'UNKNOWN', error?.message ?? 'Something went wrong. Please try again.', error?.details);
  }
  return payload as T;
}
