import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { AppLayout } from '../layout/AppLayout';
import { HomePage } from '@/pages/home/HomePage';
import { LibraryPage } from '@/pages/library/LibraryPage';
import { UploadPage } from '@/pages/upload/UploadPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { ErrorPage } from '@/pages/error/ErrorPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'library',
  component: LibraryPage
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'upload',
  component: UploadPage
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'settings',
  component: SettingsPage
});

const errorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'error',
  component: ErrorPage
});

const routeTree = rootRoute.addChildren([homeRoute, libraryRoute, uploadRoute, settingsRoute, errorRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPendingMs: 250,
  defaultNotFoundComponent: () => <NotFoundPage />
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
