import type { Approval } from "@/types";

export const approvals: Approval[] = [
  {
    id: "APR-240811-01",
    recommendationId: "PRC-2026-0811-003",
    item: "Jagung",
    action: "BUY",
    quantity: 500,
    value: 2875000000,
    requester: "Rina Putri",
    approver: "Andi Pratama",
    priority: "TINGGI",
    status: "PENDING",
    createdAt: "11 Agustus 2026 • 20.58"
  },
  {
    id: "APR-240811-02",
    recommendationId: "SAL-2026-0811-002",
    item: "Karkas beku",
    action: "SELL",
    quantity: 38,
    value: 1444000000,
    requester: "Budi Santoso",
    approver: "Sinta Wijaya",
    priority: "SEDANG",
    status: "PENDING",
    createdAt: "11 Agustus 2026 • 18.35"
  }
];
