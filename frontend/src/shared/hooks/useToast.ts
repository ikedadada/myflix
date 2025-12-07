import { useCallback } from 'react';
import { toast as sonnerToast } from 'sonner';

export const useToast = () => {
  return useCallback(
    (message: string, options?: Parameters<typeof sonnerToast>[1]) =>
      sonnerToast(message, options),
    []
  );
};
