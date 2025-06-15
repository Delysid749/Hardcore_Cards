import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import { ReactPlugin } from '@stagewise-plugins/react';
import './App.css';

/**
 * 主应用组件
 * 
 * 原理说明：
 * 1. RouterProvider：提供路由上下文，使整个应用支持路由功能
 * 2. StagewiseToolbar：AI辅助开发工具栏，仅在开发模式下显示
 * 3. 简化的应用结构，专注于核心功能
 */

function App() {
  return (
    <div className="App">
      {/* React Router 路由提供者 */}
      <RouterProvider router={router} />
      
      {/* Stagewise AI开发工具栏 - 仅在开发模式下加载 */}
      <StagewiseToolbar 
        config={{
          plugins: [ReactPlugin]
        }}
      />
    </div>
  );
}

export default App;
