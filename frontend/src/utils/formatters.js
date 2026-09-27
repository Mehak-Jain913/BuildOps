/**
 * Common formatting helpers for construction metrics & data display
 */

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (val) => {
  if (val === undefined || val === null) return '0';
  return new Intl.NumberFormat('en-US').format(val);
};

export const formatPercent = (val) => {
  if (val === undefined || val === null) return '0%';
  return `${val > 0 ? '+' : ''}${val}%`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
