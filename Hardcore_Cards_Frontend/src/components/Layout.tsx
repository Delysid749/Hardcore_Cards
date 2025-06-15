import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * 简化布局组件
 * 
 * 原理说明：
 * 1. 极简设计，不包含任何导航栏或侧边栏
 * 2. 直接渲染子路由组件，保持页面清爽
 * 3. 全屏显示内容，专注于核心功能
 */

const Layout: React.FC = () => {

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* 简化的主内容区域 */}
      <Outlet />
    </div>
  );
};

export default Layout; 