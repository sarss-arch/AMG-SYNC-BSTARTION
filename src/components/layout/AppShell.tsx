"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AmgSyncLogo } from "@/components/brand/AmgSyncLogo";
import { Icon } from "@/components/ui/Icon";
import { moduleMeta } from "@/config/workspaces";
import { useWorkspace } from "@/context/WorkspaceContext";

const groupOrder = ["Utama", "Intelligence", "Operasional", "Trust & Control"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, user, workspace, membership, signOut } = useWorkspace();
  
  // Shield against hydration layout language errors
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (!workspace || !membership) router.replace("/workspace");
  }, [ready, user, workspace, membership, router]);

  // Force both server and client to match with a clean loading placeholder
  if (!mounted || !ready || !user || !workspace || !membership) {
    return <div className="center-state">Menyiapkan workspace AMG SYNC…</div>;
  }

  const modules = workspace.modules.map((id) => ({ id, ...moduleMeta[id] }));
  const grouped = groupOrder.map((group) => ({
    group,
    items: modules.filter((item) => item.group === group)
  })).filter((entry) => entry.items.length > 0);

  function doLogout() {
    signOut();
    router.push("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <AmgSyncLogo inverse />
        </div>

        <div className="workspace">
          <div className="workspace-label">Workspace aktif</div>
          <div className="workspace-name">{workspace.shortName}</div>
          <div className="workspace-role">{membership.roleName}</div>
          {user.memberships.length > 1 ? (
            <Link href="/workspace" className="workspace-switch">Ganti workspace</Link>
          ) : null}
        </div>

        <nav className="sidebar-nav" aria-label="Navigasi utama">
          {grouped.map(({ group, items }) => (
            <div className="nav-group" key={group}>
              <div className="nav-label">{group}</div>
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link key={item.id} href={item.href} className={`nav-link ${active ? "active" : ""}`}>
                    <Icon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="nav-spacer" />
        <div className="sidebar-footer">
          <button className="nav-link nav-button" onClick={doLogout}>
            <Icon name="logout" size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-context">
            <span className="status-dot" />
            <span>{workspace.legalName}</span>
            <span className="topbar-separator">•</span>
            <span>{workspace.business}</span>
            {membership.roleCode === "BOARD_VIEWER" ? (
              <>
                <span className="topbar-separator">•</span>
                <strong style={{color:"#3D5300"}}>Mode baca</strong>
              </>
            ) : null}
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifikasi" onClick={() => window.alert("Tidak ada notifikasi baru pada data demo.")}>
              <Icon name="bell" size={18} />
            </button>
            <div className="user-chip" title={user.email}>
              {user.name.split(" ").map((x) => x[0]).slice(0,2).join("")}
            </div>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
