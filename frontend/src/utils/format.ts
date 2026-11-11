const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const formatPrice = (n: number) => inr.format(Math.round(n));

export const discountPercent = (price: number, original?: number) =>
  original && original > price ? Math.round(((original - price) / original) * 100) : 0;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const pluralize = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;
