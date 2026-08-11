"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AmgSyncLogo } from "@/components/brand/AmgSyncLogo";
import { useWorkspace } from "@/context/WorkspaceContext";
import { workspaces } from "@/config/workspaces";
import type { WorkspaceId } from "@/types";

export default function WorkspacePage() {
  const router = useRouter();
  const { ready, user, workspace, selectWorkspace } = useWorkspace();

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.memberships.length === 1 && workspace) router.replace("/ringkasan");
  }, [ready, user, workspace, router]);

  if (!ready || !user) {
    return <div className="center-state">Memuat akses workspace…</div>;
  }

  function choose(id: WorkspaceId) {
    if (selectWorkspace(id)) router.push("/ringkasan");
  }

  return (
    <div className="workspace-page">
      <div className="workspace-page-head">
        <AmgSyncLogo />
        <div>
          <h1 className="page-title">Pilih workspace</h1>
          <div className="page-subtitle">
            Halo {user.name}. Hanya workspace yang sudah diberikan ke akunmu yang ditampilkan.
          </div>
        </div>
      </div>

      <div className="workspace-cards">
        {user.memberships.map((membership) => {
          const item = workspaces[membership.workspaceId];
          return (
            <button
              key={item.id}
              className="workspace-card"
              onClick={() => choose(item.id)}
            >
              <div className="workspace-card-top">
                <span className="workspace-code">{item.id}</span>
                <span className="workspace-role-pill">{membership.roleName}</span>
              </div>
              <h2>{item.shortName}</h2>
              <p>{item.business}</p>
              <div className="workspace-card-foot">Masuk ke workspace →</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
