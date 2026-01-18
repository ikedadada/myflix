import type { ReactNode } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { APP_NAME } from '@/config';
import { useAuthUser } from '@/components/features/auth/hooks/useAuthUser';
import { UserMenu } from '@/components/ui/UserMenu';

interface Props {
  children?: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  const { data: user } = useAuthUser();

  return (
    <div className="min-h-screen">
      <header className="relative z-30 flex items-center justify-between border-b border-border bg-card/90 px-6 py-3 backdrop-blur">
        <Link to="/" className="text-lg font-semibold tracking-wide text-foreground">
          {APP_NAME}
        </Link>
        <UserMenu user={user} />
      </header>
      <main className="mx-auto w-full px-6 py-10">
        {children ?? <Outlet />}
      </main>
    </div>
  );
};
