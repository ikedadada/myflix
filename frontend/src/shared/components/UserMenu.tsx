import { Link } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ApiUser } from '@/shared/types/api';

interface Props {
  user?: ApiUser;
}

const useOutsideClose = (
  isOpen: boolean,
  refs: Array<React.RefObject<HTMLElement>>,
  onClose: () => void
) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      onClose();
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, refs, onClose]);
};

const toInitial = (displayName?: string, email?: string): string => {
  const source = (displayName ?? email ?? '?').trim();
  const initial = source.charAt(0).toUpperCase();
  return initial || '?';
};

export const UserMenu = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const initial = useMemo(() => toInitial(user?.displayName, user?.email), [user]);

  useOutsideClose(
    open,
    [menuRef, buttonRef],
    () => setOpen(false)
  );

  const handleToggle = () => setOpen((prev) => !prev);
  const handleSelect = () => setOpen(false);

  return (
    <div className="relative z-20">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-menu"
        onClick={handleToggle}
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
          className="absolute right-0 top-12 z-30 w-52 rounded-xl border border-border bg-card/95 p-2 text-sm text-text shadow-lg backdrop-blur"
        >
          <div className="px-3 py-2 text-xs uppercase tracking-wide text-muted">Navigate</div>
          <ul className="space-y-1">
            <li className="rounded-lg px-3 py-2 hover:bg-surface">
              <Link to="/library" role="menuitem" className="block w-full text-text" onClick={handleSelect}>
                Library
              </Link>
            </li>
            <li className="rounded-lg px-3 py-2 hover:bg-surface">
              <Link to="/upload" role="menuitem" className="block w-full text-text" onClick={handleSelect}>
                Upload
              </Link>
            </li>
            <li className="rounded-lg px-3 py-2 hover:bg-surface">
              <Link to="/settings" role="menuitem" className="block w-full text-text" onClick={handleSelect}>
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
  );
};
