import React, { lazy, Suspense } from 'react';
import { Navigate, useRoutes, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute'

const DashboardLayout = lazy(() => import('./layouts/dashboard'))
/* const Dashboard = lazy(() => import('./pages/Dashboard'))
 */
const LoginPage = lazy(() => import('./pages/LoginPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const UserInfoPage = lazy(() => import('./pages/UserInfoPage'))
const UserPasswordPage = lazy(() => import('./pages/UserPasswordPage'))
const UsersManagePage = lazy(() => import('./pages/UsersManagePage'))
const UsersAuthPage = lazy(() => import('./pages/UsersAuthPage'))
const ApplicationsManagePage = lazy(() => import('./pages/ApplicationsManagePage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <PrivateRoute><UserInfoPage /></PrivateRoute> },
        { path: '/alterar_senha', element: <PrivateRoute><UserPasswordPage /></PrivateRoute> },
        { path: '/gerenciar_usuarios', element: <PrivateRoute><UsersManagePage /></PrivateRoute> },
        { path: '/autorizar_usuarios', element: <PrivateRoute><UsersAuthPage /></PrivateRoute> },
        { path: '/gerenciar_aplicacoes', element: <PrivateRoute><ApplicationsManagePage /></PrivateRoute> },
        { path: '/dashboard', element: <PrivateRoute><DashboardPage /></PrivateRoute> },
      ]
    },
    {
      path: '/login',
      children: [{
        path: '/login',
        element: <LoginPage />
      }]
    },
    {
      path: '/404',
      children: [{
        path: '/404',
        element: <NotFoundPage />
      }]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
