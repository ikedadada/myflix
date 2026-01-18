export const formatDate = (date: string | number | Date): string => {
  const value = typeof date === 'string' ? new Date(date) : new Date(date);
  return value.toLocaleDateString();
};
