import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { APP_NAME } from '../config/constants';
import { useAuthUser } from '@/shared/hooks/useAuthUser';

interface Props {
  children?: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  const { data: user } = useAuthUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const initial = useMemo(() => {
    const source = (user?.displayName ?? user?.email ?? '?').trim();
    return source.charAt(0).toUpperCase() || '?';
  }, [user]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!open) return;
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div className="min-h-screen">
      <header className="relative z-30 flex items-center justify-between border-b border-border bg-card/90 px-8 py-4 backdrop-blur">
        <Link to="/" className="text-xl font-semibold tracking-wide text-text">
          {APP_NAME}
        </Link>
        <div className="relative z-20">
          <button
            ref={buttonRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls="user-menu"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-base font-semibold text-surface shadow-lg transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            {initial}
          </button>
          {open && (
            <div
              ref={menuRef}
              id="user-menu"
              role="menu"
              aria-label="User menu"
              className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-border bg-card/95 p-2 text-sm text-text shadow-lg backdrop-blur"
            >
              <div className="px-3 py-2 text-xs uppercase tracking-wide text-muted">Navigate</div>
              <ul className="space-y-1">
                <li className="rounded-lg px-3 py-2 hover:bg-surface">
                  <Link
                    to="/library"
                    role="menuitem"
                    className="block w-full text-text"
                    onClick={() => setOpen(false)}
                  >
                    Library
                  </Link>
                </li>
                <li className="rounded-lg px-3 py-2 hover:bg-surface">
                  <Link
                    to="/upload"
                    role="menuitem"
                    className="block w-full text-text"
                    onClick={() => setOpen(false)}
                  >
                    Upload
                  </Link>
                </li>
                <li className="rounded-lg px-3 py-2 hover:bg-surface">
                  <Link
                    to="/settings"
                    role="menuitem"
                    className="block w-full text-text"
                    onClick={() => setOpen(false)}
                  >
                    Settings
                  </Link>
                </li>
              </ul>
              <div className="mt-2 rounded-lg bg-surface/80 px-3 py-2 text-xs text-muted">
                {user?.displayName ?? user?.email ?? 'Signed in'}
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto w-full px-6 py-10">
        {children ?? <Outlet />}
      </main>
    </div>
  );
};
