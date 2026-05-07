import { useState, useEffect, FormEvent } from "react";
import { useLocation } from "wouter";
import { adminLogin, setToken, adminMe } from "@/lib/api";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      if (await adminMe()) navigate("/admin");
    })();
  }, [navigate]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await adminLogin(email, password);
    setLoading(false);
    if (result.token) {
      setToken(result.token);
      navigate("/admin");
    } else {
      setError(result.error || "Login failed");
    }
  }

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <div className="admin-auth-brand">
          <span className="brand-name">WirfonCloud</span>
          <span className="brand-tagline">Admin</span>
        </div>
        <h2>Sign in</h2>
        <p className="muted">Manage your site content.</p>
        <form onSubmit={handleSubmit} className="admin-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          {error && <div className="form-status error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
