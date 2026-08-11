import { approvals } from "@/data/mock/approvals";

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getApprovals() {
  await delay();
  return approvals;
}

export async function getApproval(id: string) {
  await delay();
  return approvals.find((item) => item.id === id) ?? approvals[0];
}
