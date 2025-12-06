import type { ReactNode } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { APP_NAME } from '../config/constants';
import { useAuthUser } from '@/shared/hooks/useAuthUser';

interface Props {
  children?: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  const { data: user } = useAuthUser();
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border bg-card/90 px-8 py-4 backdrop-blur">
        <Link to="/" className="text-xl font-semibold tracking-wide text-text">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted">
          <Link to="/library" className="hover:text-text">
            Library
          </Link>
          <Link to="/upload" className="hover:text-text">
            Upload
          </Link>
          <Link to="/settings" className="hover:text-text">
            Settings
          </Link>
          <span className="text-muted">
            Signed in{user?.displayName ? ` as ${user.displayName}` : ''}
          </span>
        </nav>
      </header>
      <main className="mx-auto w-full px-6 py-10">
        {children ?? <Outlet />}
      </main>
    </div>
  );
};
