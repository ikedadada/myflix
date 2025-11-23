import { useCallback } from 'react';

export const useToast = () => {
  return useCallback((message: string) => {
    // eslint-disable-next-line no-alert
    alert(message);
  }, []);
};
