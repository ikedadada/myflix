import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { AppLayout } from '../layout/AppLayout';
import { HomePage } from '@/pages/home/HomePage';
import { LibraryPage } from '@/pages/library/LibraryPage';
import { UploadPage } from '@/pages/upload/UploadPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { VideoDetailPage } from '@/pages/video-detail/VideoDetailPage';
import { ErrorPage } from '@/pages/error/ErrorPage';
import { NotFoundPage } from '@/pages/error/NotFoundPage';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-surface text-text">
      <Outlet />
    </div>
  )
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app-layout',
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
});

const homeRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  component: HomePage
});

const libraryRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'library',
  component: LibraryPage
});

const uploadRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'upload',
  component: UploadPage
});

const videoDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'videos/$videoId',
  component: VideoDetailPage
});

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'settings',
  component: SettingsPage
});

const errorRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'error',
  component: ErrorPage
});

const routeTree = rootRoute.addChildren([
  appLayoutRoute.addChildren([homeRoute, libraryRoute, uploadRoute, settingsRoute, errorRoute]),
  videoDetailRoute
]);

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
