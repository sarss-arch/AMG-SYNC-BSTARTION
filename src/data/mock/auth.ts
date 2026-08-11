import type { MockUser } from "@/types";

const allViewerMemberships = [
  { workspaceId: "AMG" as const, roleCode: "GROUP_EXECUTIVE", roleName: "Group Executive", permissions: ["GROUP_VIEW","APPROVE_LARGE","VIEW_ALL_SHARED"] },
  { workspaceId: "PAM" as const, roleCode: "BOARD_VIEWER", roleName: "Board Viewer", permissions: ["VIEW_SHARED"] },
  { workspaceId: "HYBRO" as const, roleCode: "BOARD_VIEWER", roleName: "Board Viewer", permissions: ["VIEW_SHARED"] },
  { workspaceId: "GSU" as const, roleCode: "BOARD_VIEWER", roleName: "Board Viewer", permissions: ["VIEW_SHARED"] },
  { workspaceId: "CIF" as const, roleCode: "BOARD_VIEWER", roleName: "Board Viewer", permissions: ["VIEW_SHARED"] },
  { workspaceId: "MPS" as const, roleCode: "BOARD_VIEWER", roleName: "Board Viewer", permissions: ["VIEW_SHARED"] },
  { workspaceId: "AMP" as const, roleCode: "BOARD_VIEWER", roleName: "Board Viewer", permissions: ["VIEW_SHARED"] }
];

export const mockUsers: MockUser[] = [
  {
    id: "USR-EXEC-01",
    name: "Alya Santoso",
    email: "executive@amgsync.id",
    memberships: allViewerMemberships
  },
  {
    id: "USR-CIF-01",
    name: "Rina Putri",
    email: "procurement@amgsync.id",
    memberships: [
      {
        workspaceId: "CIF",
        roleCode: "PROCUREMENT_MANAGER",
        roleName: "Manajer Procurement",
        permissions: ["VIEW_MARKET","VIEW_FORECAST","RUN_SIMULATION","CREATE_BUY_REQUEST","APPROVE_BUY"]
      }
    ]
  },
  {
    id: "USR-GSU-01",
    name: "Dimas Prakoso",
    email: "farm@amgsync.id",
    memberships: [
      {
        workspaceId: "GSU",
        roleCode: "FARM_MANAGER",
        roleName: "Farm Manager",
        permissions: ["VIEW_PRODUCTION","VIEW_HARVEST","VIEW_INVENTORY"]
      }
    ]
  },
  {
    id: "USR-AMP-01",
    name: "Sinta Wijaya",
    email: "sales@amgsync.id",
    memberships: [
      {
        workspaceId: "AMP",
        roleCode: "SALES_MANAGER",
        roleName: "Sales Manager",
        permissions: ["VIEW_SALES","VIEW_DEMAND","VIEW_DISTRIBUTION","CREATE_SELL_REQUEST"]
      }
    ]
  }
];

export function findMockUser(email: string) {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
}
