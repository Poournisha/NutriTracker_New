export const formatNumber = (val: number | undefined | null, decimals = 1): string => {
  if (val === undefined || val === null || isNaN(val)) return '0';
  return val.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
};
