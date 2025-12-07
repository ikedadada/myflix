import { useCallback } from 'react';
import { toast as sonnerToast } from 'sonner';

type ToastOptions = Parameters<typeof sonnerToast>[1];

export const useToast = () => {
  const info = useCallback(
    (message: string, options?: ToastOptions) => sonnerToast(message, options),
    []
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => sonnerToast.success(message, options),
    []
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => sonnerToast.error(message, options),
    []
  );

  return { info, success, error };
};
