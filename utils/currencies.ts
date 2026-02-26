// ISO 4217 currency list

export type Currency = {
  code: string;
  symbol: string;
  label: string;
};

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "PHP", symbol: "₱", label: "Philippine Peso" },
  // ...rest
];

// ⭐ FIXED TYPES
export const formatCurrency = (
  amount: number | string,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(Number(amount || 0));
};