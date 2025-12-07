import { Link } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/shared/ui/Button';
import type { ApiUser } from '@/shared/types/api';

interface Props {
  user?: ApiUser;
}

const toInitial = (displayName?: string, email?: string): string => {
  const source = (displayName ?? email ?? '?').trim();
  const initial = source.charAt(0).toUpperCase();
  return initial || '?';
};

export const UserMenu = ({ user }: Props) => {
  const initial = toInitial(user?.displayName, user?.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="md"
          className="h-10 w-10 rounded-full bg-accent text-base font-semibold text-accent-foreground shadow-lg transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={undefined} alt={user?.displayName ?? user?.email ?? 'User'} />
            <AvatarFallback className="bg-transparent text-accent-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={10}>
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {user?.displayName ?? user?.email ?? 'Signed in'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/library" className="w-full">
            Library
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/upload" className="w-full">
            Upload
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="w-full">
            Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
