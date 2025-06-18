import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import Header from './Header';

const { Content } = AntLayout;

/**
 * 主布局组件
 * 
 * 原理说明：
 * 1. 使用Ant Design的Layout组件作为基础布局
 * 2. 包含Header顶栏，显示用户信息和导航
 * 3. Content区域渲染子路由组件
 * 4. 响应式设计，适配不同屏幕尺寸
 * 5. 统一的页面布局结构，保持一致的用户体验
 */

const Layout: React.FC = () => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* 顶栏 - 包含用户信息和导航 */}
      <Header />
      
      {/* 主内容区域 */}
      <Content style={{ 
        background: '#f0f2f5',
        minHeight: 'calc(100vh - 64px)' // 减去Header高度
      }}>
        <Outlet />
      </Content>
    </AntLayout>
  );
};

export default Layout; 