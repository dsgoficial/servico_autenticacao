// Path: routes\index.tsx
import { Suspense, lazy, ReactNode } from 'react';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouteObject,
  ScrollRestoration,
} from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { UserRole } from '@/types/auth';
import { ErrorBoundaryRoute } from './ErrorBoundaryRoute';
import { tokenService } from '../services/tokenService';

// Layouts
const AppLayout = lazy(() => import('@/components/layouts/AppLayout'));

// Pages with lazy loading
const Login = lazy(() => import('@/features/auth/routes/Login'));
const SignUp = lazy(() => import('@/features/auth/routes/SignUp'));
const UserInfo = lazy(() => import('@/features/users/routes/UserInfo'));
const UserPassword = lazy(() => import('@/features/users/routes/UserPassword'));
const UsersManage = lazy(() => import('@/features/users/routes/UsersManage'));
const UsersAuth = lazy(() => import('@/features/users/routes/UsersAuth'));
const ApplicationsManage = lazy(
  () => import('@/features/applications/routes/ApplicationsManage'),
);
const Dashboard = lazy(() => import('@/features/dashboard/routes/Dashboard'));
const NotFound = lazy(() => import('./NotFound'));
const Unauthorized = lazy(() => import('./Unauthorized'));

const LoadingFallback = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

// Create an error boundary wrapper to fix the children prop issue
const ErrorBoundaryWrapper = ({ children }: { children?: ReactNode }) => (
  <ErrorBoundaryRoute>
    {children || <Typography>An error occurred</Typography>}
  </ErrorBoundaryRoute>
);

// Safely check if token is expired
const checkTokenExpiration = (): boolean => {
  return tokenService.isTokenExpiredOrMissing();
};

// Auth loaders for protected routes
const authLoader = () => {
  try {
    const token = localStorage.getItem('@authserver-Token');
    const isAuthenticated = !!token && !checkTokenExpiration();

    if (!isAuthenticated) {
      // Redirect to login and remember the intended destination
      const currentPath = window.location.pathname;
      return redirect(`/login?from=${encodeURIComponent(currentPath)}`);
    }

    return null; // Continue to the route if authenticated
  } catch (error) {
    console.error('Error in auth loader:', error);
    return redirect('/login');
  }
};

// Admin role checker
const adminLoader = () => {
  try {
    const role = localStorage.getItem('@authserver-User-Authorization');

    if (role !== UserRole.ADMIN) {
      return redirect('/unauthorized');
    }

    return null; // Continue if admin
  } catch (error) {
    console.error('Error in admin loader:', error);
    return redirect('/unauthorized');
  }
};

// Helper for layout with scroll restoration
const AppLayoutWithScrollRestoration = () => (
  <>
    <AppLayout />
    <ScrollRestoration />
  </>
);

// Define routes using the object format
const routes: RouteObject[] = [
  // Public routes
  {
    path: 'login',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
    errorElement: <ErrorBoundaryWrapper />,
  },
  {
    path: 'cadastro',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SignUp />
      </Suspense>
    ),
    errorElement: <ErrorBoundaryWrapper />,
  },

  // Protected routes
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AppLayoutWithScrollRestoration />
      </Suspense>
    ),
    loader: authLoader, // Apply auth check to the entire section
    errorElement: <ErrorBoundaryWrapper />,
    children: [
      {
        path: '',
        element: <UserInfo />,
      },
      {
        path: 'alterar_senha',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <UserPassword />
          </Suspense>
        ),
      },
      // Admin routes
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        ),
        loader: adminLoader,
      },
      {
        path: 'gerenciar_usuarios',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <UsersManage />
          </Suspense>
        ),
        loader: adminLoader,
      },
      {
        path: 'autorizar_usuarios',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <UsersAuth />
          </Suspense>
        ),
        loader: adminLoader,
      },
      {
        path: 'gerenciar_aplicacoes',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ApplicationsManage />
          </Suspense>
        ),
        loader: adminLoader,
      },
    ],
  },

  // Error routes
  {
    path: 'unauthorized',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Unauthorized />
      </Suspense>
    ),
    errorElement: <ErrorBoundaryWrapper />,
  },
  {
    path: '404',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
    errorElement: <ErrorBoundaryWrapper />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
];

// Create the router with the routes configuration
const router = createBrowserRouter(routes);

// Export router instance for use outside of components
export default router;

// Export a function to perform navigation from outside React components
export const navigateToLogin = () => {
  // Use the router's navigate function with replace:true to prevent back navigation to the secure page
  router.navigate('/login', { replace: true });
};
