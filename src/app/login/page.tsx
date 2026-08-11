"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AmgSyncLogo } from "@/components/brand/AmgSyncLogo";
import { useWorkspace } from "@/context/WorkspaceContext";

const demoAccounts = [
  { email: "executive@amgsync.id", label: "Group Executive", note: "Akses AMG Group + seluruh workspace viewer" },
  { email: "procurement@amgsync.id", label: "Manajer Procurement", note: "Citra Ina Feedmill" },
  { email: "farm@amgsync.id", label: "Farm Manager", note: "Gunung Sari Utama" },
  { email: "sales@amgsync.id", label: "Sales Manager", note: "Argo Makmur Proteindo" }
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useWorkspace();
  const [email, setEmail] = useState("executive@amgsync.id");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError("Password demo wajib diisi.");
      return;
    }
    const result = signIn(email);
    if (!result.ok || !result.user) {
      setError(result.reason ?? "Login gagal.");
      return;
    }
    setError("");
    router.push(result.user.memberships.length > 1 ? "/workspace" : "/ringkasan");
  }

  return (
    <div className="login-shell">
      <section className="login-art">
        <div className="login-copy">
          <AmgSyncLogo inverse />
          <div className="login-kicker">Satu platform · satu data backbone · keputusan yang selaras</div>
          <h1>Sinkronkan data. Putuskan lebih cepat.</h1>
          <p>
            AMG SYNC menghubungkan price intelligence, sourcing, produksi, traceability,
            demand, dan distribusi ke dalam satu control tower yang role-aware.
          </p>

          <div className="login-flow" aria-label="Alur platform">
            <span>Predict</span><b>→</b><span>Source</span><b>→</b><span>Trace</span><b>→</b><span>Distribute</span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={submit}>
          <div className="login-mobile-brand"><AmgSyncLogo /></div>
          <h2>Masuk ke AMG SYNC</h2>
          <div className="page-subtitle">
            Role tidak dipilih bebas. Workspace dan hak akses mengikuti membership akun.
          </div>

          <div className="field">
            <label>Email kerja</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error ? <div className="inline-error">{error}</div> : null}

          <button className="btn btn-primary" style={{ width: "100%", marginTop: 18 }}>Masuk</button>

          <div className="demo-box">
            <strong>Akun demo</strong>
            <div className="demo-account-list">
              {demoAccounts.map((account) => (
                <button
                  type="button"
                  className={`demo-account ${email === account.email ? "selected" : ""}`}
                  key={account.email}
                  onClick={() => setEmail(account.email)}
                >
                  <span>{account.label}</span>
                  <small>{account.note}</small>
                </button>
              ))}
            </div>
            <div className="metric-note">Password demo: <strong>demo1234</strong></div>
          </div>
        </form>
      </section>
    </div>
  );
}
