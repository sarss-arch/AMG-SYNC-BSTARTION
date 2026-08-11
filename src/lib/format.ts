export const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export const compactRupiah = (value: number) => {
  if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(2).replace(".", ",")} M`;
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(0)} jt`;
  return rupiah(value);
};

export const pricePerKg = (value: number) =>
  `Rp${new Intl.NumberFormat("id-ID").format(value)}/kg`;
