export type Me = { login: string; avatarUrl: string };

export type Link = {
  short_code: string;
  long_url: string;
  user_id: string;
  created_at: string; // ISO 8601
  expires_at: string;
  is_active: boolean;
};

export type LinkListResponse = {
  total: number;
  count: number;
  offset: number;
  items: Link[];
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/v1${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error ?? res.statusText);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  me: () => req<Me>("/me"),
  logout: () => req<void>("/auth/logout", { method: "POST" }),
  createLink: (target: string) =>
    req<Link>("/links", {
      method: "POST",
      body: JSON.stringify({ long_url: target }),
    }),
  listLinks: () => req<LinkListResponse>("/me/links"),
  deleteLink: (code: string) =>
    req<void>(`/links/${code}`, { method: "DELETE" }),
};
