import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Spin } from 'antd';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * 路由懒加载组件
 * 
 * 原理说明：
 * 1. lazy()：React提供的代码分割API
 * 2. 只有访问对应路由时才加载组件代码
 * 3. 减少首屏加载时间，提升用户体验
 * 4. Suspense：处理懒加载组件的loading状态
 */

// 公共页面（无需登录）
const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const HomePage = lazy(() => import('../pages/Home'));

// 需要登录的页面
const KanbanListPage = lazy(() => import('../pages/KanbanList'));
const KanbanDetailPage = lazy(() => import('../pages/KanbanDetail'));
const UserProfilePage = lazy(() => import('../pages/UserProfile'));
const InvitationPage = lazy(() => import('../pages/Invitation'));

/**
 * 懒加载包装组件
 * 
 * 原理说明：
 * 为所有懒加载组件提供统一的loading UI
 */
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense 
    fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <Spin size="large" tip="页面加载中..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

/**
 * 路由配置
 * 
 * 原理说明：
 * 1. createBrowserRouter：使用HTML5 History API的路由器
 * 2. 嵌套路由：Layout作为父路由，包含公共的导航栏、侧边栏等
 * 3. 路由守卫：ProtectedRoute组件保护需要登录的页面
 * 4. 重定向：默认路径重定向到首页
 * 
 * 对应原项目路由：
 * - /login → LoginRegister.vue
 * - /home → KanbanHome.vue  
 * - /kanban/:id → KanbanContent.vue
 * - /user → User.vue
 * - /invitation → Invitation.vue
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/login',
    element: (
      <LazyWrapper>
        <LoginPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/register', 
    element: (
      <LazyWrapper>
        <RegisterPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/',
    element: <Layout />, // 主布局组件
    children: [
      {
        path: 'home',
        element: (
          <LazyWrapper>
            <HomePage />
          </LazyWrapper>
        ),
      },
      {
        path: 'kanbans',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <KanbanListPage />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'kanban/:id',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <KanbanDetailPage />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <UserProfilePage />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: 'invitation',
        element: (
          <ProtectedRoute>
            <LazyWrapper>
              <InvitationPage />
            </LazyWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    // 404页面
    path: '*',
    element: (
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 20px' 
      }}>
        <h1>404 - 页面未找到</h1>
        <p>您访问的页面不存在</p>
      </div>
    ),
  },
]);

export default router; 