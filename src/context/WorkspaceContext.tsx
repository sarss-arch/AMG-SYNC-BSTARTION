"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { findMockUser } from "@/data/mock/auth";
import { workspaces } from "@/config/workspaces";
import type { MockUser, WorkspaceDefinition, WorkspaceMembership, WorkspaceId } from "@/types";

type WorkspaceContextValue = {
  ready: boolean;
  user: MockUser | null;
  workspace: WorkspaceDefinition | null;
  membership: WorkspaceMembership | null;
  signIn: (email: string) => { ok: boolean; user?: MockUser; reason?: string };
  selectWorkspace: (workspaceId: WorkspaceId) => boolean;
  signOut: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

const SESSION_KEY = "amg-sync-session-v3";

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [workspaceId, setWorkspaceId] = useState<WorkspaceId | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { email?: string; workspaceId?: WorkspaceId };
        if (parsed.email && findMockUser(parsed.email)) {
          setEmail(parsed.email);
          if (parsed.workspaceId) setWorkspaceId(parsed.workspaceId);
        }
      }
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    } finally {
      setReady(true);
    }
  }, []);

  const user = useMemo(() => (email ? findMockUser(email) ?? null : null), [email]);

  const membership = useMemo(() => {
    if (!user || !workspaceId) return null;
    return user.memberships.find((item) => item.workspaceId === workspaceId) ?? null;
  }, [user, workspaceId]);

  const workspace = membership ? workspaces[membership.workspaceId] : null;

  function persist(nextEmail: string | null, nextWorkspace: WorkspaceId | null) {
    if (!nextEmail) {
      window.localStorage.removeItem(SESSION_KEY);
      return;
    }
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({
      email: nextEmail,
      workspaceId: nextWorkspace
    }));
  }

  function signIn(nextEmail: string) {
    const found = findMockUser(nextEmail);
    if (!found) {
      return {
        ok: false,
        reason: "Akun demo tidak ditemukan. Gunakan salah satu akun yang tersedia di halaman login."
      };
    }
    const only = found.memberships.length === 1 ? found.memberships[0].workspaceId : null;
    setEmail(found.email);
    setWorkspaceId(only);
    persist(found.email, only);
    return { ok: true, user: found };
  }

  function selectWorkspace(nextWorkspaceId: WorkspaceId) {
    if (!user?.memberships.some((item) => item.workspaceId === nextWorkspaceId)) return false;
    setWorkspaceId(nextWorkspaceId);
    persist(user.email, nextWorkspaceId);
    return true;
  }

  function signOut() {
    setEmail(null);
    setWorkspaceId(null);
    persist(null, null);
  }

  return (
    <WorkspaceContext.Provider value={{
      ready, user, workspace, membership, signIn, selectWorkspace, signOut
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return value;
}
