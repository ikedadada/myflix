import type { ReactNode } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { APP_NAME } from '../config/constants';
import { useTheme } from '../providers/ThemeProvider';
import { Button } from '@/shared/ui/Button';

interface Props {
  children?: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  const { toggle, theme } = useTheme();
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-8 py-4">
        <Link to="/" className="text-xl font-semibold tracking-wide">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/library" className="text-white/80 hover:text-white">
            Library
          </Link>
          <Link to="/upload" className="text-white/80 hover:text-white">
            Upload
          </Link>
          <Link to="/settings" className="text-white/80 hover:text-white">
            Settings
          </Link>
          <Button variant="ghost" size="sm" onClick={toggle}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
        {children ?? <Outlet />}
      </main>
    </div>
  );
};
