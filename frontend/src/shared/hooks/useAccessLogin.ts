import { useMemo } from 'react';
import { buildAccessLoginUrl } from '@/app/config/env';

export const useAccessLogin = () => {
  const loginUrl = useMemo(() => buildAccessLoginUrl(window.location.href), []);
  const login = () => {
    if (loginUrl) {
      window.location.href = loginUrl;
    }
  };
  return { loginUrl, login };
};
