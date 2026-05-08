import { useState, useEffect, FormEvent } from "react";
import { useLocation } from "wouter";
import { adminLogin, setToken, adminMe } from "@/lib/api";
import wirfonLogo from "@assets/001wirfoncloud_kleppen2_1778163190666.png";

function CloudIllustration() {
  return (
    <svg viewBox="0 0 420 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="auth-illustration" aria-hidden="true">
      {/* Background blobs */}
      <circle cx="190" cy="180" r="110" fill="#e8f4fd" />
      <circle cx="290" cy="240" r="60" fill="#fef9e7" opacity="0.8" />
      <circle cx="90" cy="260" r="40" fill="#eaf9f0" opacity="0.7" />

      {/* Dashed orbit */}
      <ellipse cx="195" cy="175" rx="130" ry="90" stroke="#0199ef" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.35" />

      {/* Monitor body */}
      <rect x="100" y="120" width="190" height="130" rx="10" fill="#fff" stroke="#c8e4f8" strokeWidth="2" />
      <rect x="113" y="132" width="164" height="100" rx="6" fill="#e8f4fd" />
      {/* Monitor stand */}
      <rect x="175" y="250" width="40" height="18" rx="3" fill="#b0d4ee" />
      <rect x="158" y="267" width="74" height="8" rx="4" fill="#b0d4ee" />

      {/* Cloud on screen */}
      <path d="M155 198 q-16 0-16-16 q0-12 12-14 q2-14 20-14 q10 0 16 6 q4-2 8-2 q14 0 14 14 q8 2 8 12 q0 14-16 14z"
        fill="#0199ef" opacity="0.18" />
      <path d="M155 198 q-16 0-16-16 q0-12 12-14 q2-14 20-14 q10 0 16 6 q4-2 8-2 q14 0 14 14 q8 2 8 12 q0 14-16 14z"
        fill="none" stroke="#0199ef" strokeWidth="2" />

      {/* Person silhouette below cloud */}
      <circle cx="195" cy="208" r="10" fill="#0199ef" opacity="0.55" />
      <path d="M178 232 q0-18 17-18 h0 q17 0 17 18" fill="#0199ef" opacity="0.35" />

      {/* Lock badge */}
      <circle cx="238" cy="208" r="18" fill="#0199ef" />
      <rect x="231" y="207" width="14" height="11" rx="2" fill="#fff" />
      <path d="M233 207 v-4 a5 5 0 0 1 10 0 v4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="238" cy="213" r="2" fill="#0199ef" />

      {/* Shield badge top-right */}
      <path d="M290 110 l22 8 v18 q0 16-22 22 q-22-6-22-22 v-18z" fill="#fff" stroke="#0199ef" strokeWidth="2" />
      <path d="M290 124 l6 6-12 12" stroke="#0199ef" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Decorative dots */}
      <circle cx="68" cy="130" r="5" fill="#0199ef" opacity="0.45" />
      <circle cx="68" cy="150" r="5" fill="#0199ef" opacity="0.3" />
      <circle cx="68" cy="170" r="5" fill="#0199ef" opacity="0.2" />
      <circle cx="330" cy="160" r="5" fill="#005fa3" opacity="0.4" />
      <circle cx="330" cy="180" r="5" fill="#005fa3" opacity="0.25" />
      <circle cx="330" cy="200" r="5" fill="#005fa3" opacity="0.15" />
      <circle cx="120" cy="88" r="6" fill="#fbbf24" opacity="0.7" />
      <circle cx="85" cy="220" r="5" fill="#ef4444" opacity="0.4" />
      <circle cx="310" cy="270" r="5" fill="#0199ef" opacity="0.5" />

      {/* Floating plus */}
      <text x="310" y="115" fontSize="18" fill="#fbbf24" opacity="0.8" fontWeight="bold">+</text>
      <text x="72" y="100" fontSize="14" fill="#0199ef" opacity="0.5" fontWeight="bold">+</text>
    </svg>
  );
}

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
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
      setError(result.error || "Invalid email or password.");
    }
  }

  return (
    <div className="auth-page">
      {/* Background diagonal shapes */}
      <div className="auth-bg-top" />
      <div className="auth-bg-bottom" />

      <div className="auth-wrapper">
        {/* Logo above card */}
        <div className="auth-logo-wrap">
          <img src={wirfonLogo} alt="WirfonCloud" className="auth-logo" />
          <span className="auth-logo-label">WirfonCloud</span>
        </div>

        {/* Two-column card */}
        <div className="auth-card">
          {/* Left — illustration */}
          <div className="auth-left">
            <CloudIllustration />
          </div>

          {/* Divider */}
          <div className="auth-divider" />

          {/* Right — form */}
          <div className="auth-right">
            <div className="auth-accent-bar" />
            <h2 className="auth-title">Login as a Admin User</h2>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Email */}
              <div className="auth-input-wrap">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="johndoe@example.com"
                  className="auth-input"
                />
                <i className="fa-regular fa-user auth-input-icon" />
              </div>

              {/* Password */}
              <div className="auth-input-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  className="auth-input"
                />
                <button
                  type="button"
                  className="auth-pw-toggle"
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((v) => !v)}
                >
                  <i className={`fa-regular ${showPw ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
              </div>

              {error && (
                <div className="auth-error">
                  <i className="fa-solid fa-circle-exclamation" /> {error}
                </div>
              )}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <><i className="fa-solid fa-spinner fa-spin" /> Signing in…</>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            <div className="auth-help">
              <span>Forget your password?</span>
              <a href={`mailto:contact@wirfoncloud.com?subject=Admin%20Password%20Reset`} className="auth-help-link">
                Get help signing in.
              </a>
            </div>

            <div className="auth-legal">
              <a href="/about">Terms of use</a>
              <span>·</span>
              <a href="/about">Privacy policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
