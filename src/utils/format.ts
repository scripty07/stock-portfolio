export const getFormattedCurrency = (value: number, currency = 'USD') => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });
};
