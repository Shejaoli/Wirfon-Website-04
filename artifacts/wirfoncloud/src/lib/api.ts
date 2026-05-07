import type { SiteContent } from "./site";

const TOKEN_KEY = "wfc_admin_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function fetchContent(): Promise<SiteContent | null> {
  try {
    const res = await fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as SiteContent;
  } catch {
    return null;
  }
}

export async function adminLogin(email: string, password: string): Promise<{ token?: string; error?: string }> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data?.error || "Login failed" };
    return { token: data.token };
  } catch {
    return { error: "Network error" };
  }
}

export async function adminMe(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/me", { headers: authHeaders() });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.authenticated);
  } catch {
    return false;
  }
}

export async function adminLogout(): Promise<void> {
  try {
    await fetch("/api/admin/logout", { method: "POST", headers: authHeaders() });
  } catch {
    /* ignore */
  }
  setToken(null);
}

export async function adminSaveContent(data: SiteContent): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json?.error || "Save failed" };
    return { success: true };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function adminUploadImage(file: File): Promise<{ url?: string; error?: string }> {
  try {
    const buf = await file.arrayBuffer();
    const res = await fetch("/api/admin/uploads", {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        ...authHeaders(),
      },
      body: buf,
    });
    const json = await res.json();
    if (!res.ok) return { error: json?.error || "Upload failed" };
    return { url: json.url as string };
  } catch {
    return { error: "Network error" };
  }
}

export async function adminResetContent(): Promise<{ success: boolean; data?: SiteContent; error?: string }> {
  try {
    const res = await fetch("/api/admin/content/reset", {
      method: "POST",
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json?.error || "Reset failed" };
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: "Network error" };
  }
}
