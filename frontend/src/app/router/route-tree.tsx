import { Outlet, RootRoute, Route, Router } from '@tanstack/router';
import { AppLayout } from '../layout/AppLayout';
import { HomePage } from '@/pages/home/HomePage';
import { LibraryPage } from '@/pages/library/LibraryPage';
import { UploadPage } from '@/pages/upload/UploadPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { ErrorPage } from '@/pages/error/ErrorPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage';

const rootRoute = new RootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
});

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const libraryRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'library',
  component: LibraryPage
});

const uploadRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'upload',
  component: UploadPage
});

const settingsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'settings',
  component: SettingsPage
});

const errorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'error',
  component: ErrorPage
});

const routeTree = rootRoute.addChildren([homeRoute, libraryRoute, uploadRoute, settingsRoute, errorRoute]);

export const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  defaultPendingMs: 250,
  defaultNotFoundComponent: () => <NotFoundPage />
});

declare module '@tanstack/router' {
  interface Register {
    router: typeof router;
  }
}
