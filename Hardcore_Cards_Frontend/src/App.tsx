import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import { ReactPlugin } from '@stagewise-plugins/react';
import { router } from './router';
import './App.css';

/**
 * 主应用组件
 * 
 * 原理说明：
 * 1. RouterProvider：提供路由上下文，使整个应用支持路由功能
 * 2. StagewiseToolbar：开发工具，只在开发环境显示
 * 3. 移除了原有的静态内容，改为动态路由渲染
 */

function App() {
  return (
    <div className="App">
      {/* Stagewise Toolbar - 只在开发模式下显示 */}
      <StagewiseToolbar 
        config={{
          plugins: [ReactPlugin]
        }}
      />
      
      {/* React Router 路由提供者 */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
