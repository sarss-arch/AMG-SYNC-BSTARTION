import { batches } from "@/data/mock/batches";

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getBatches() {
  await delay();
  return batches;
}

export async function getBatch(id: string) {
  await delay();
  return batches.find((item) => item.id === id) ?? batches[0];
}
