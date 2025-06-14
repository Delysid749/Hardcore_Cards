import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '../store/hooks';

/**
 * 路由守卫组件
 * 
 * 原理说明：
 * 1. 检查用户是否已登录
 * 2. 未登录用户重定向到登录页
 * 3. 保存当前路径，登录后可以回到原页面
 * 4. 已登录用户正常渲染子组件
 * 
 * 对应原项目：
 * 原项目可能在每个组件中单独检查登录状态
 * 我们统一在路由层面处理，更加优雅
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  /**
   * 登录状态检查逻辑
   * 
   * 原理说明：
   * 1. 从Redux store获取登录状态
   * 2. 未登录时重定向到登录页
   * 3. state参数保存原始路径，用于登录后重定向
   */
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // 已登录，渲染受保护的组件
  return <>{children}</>;
};

export default ProtectedRoute; 