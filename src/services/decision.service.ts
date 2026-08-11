import { cornRecommendation, decisionQueue, operationalContext } from "@/data/mock/decisions";

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPrimaryRecommendation() {
  await delay();
  return cornRecommendation;
}

export async function getDecisionQueue() {
  await delay();
  return decisionQueue;
}

export async function getOperationalContext() {
  await delay();
  return operationalContext;
}
