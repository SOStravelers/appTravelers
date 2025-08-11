// utils/stripeHelpers.js
export const toStripeAmount = (value) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
};
