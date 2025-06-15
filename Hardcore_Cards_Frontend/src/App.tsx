import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './App.css';

/**
 * 主应用组件
 * 
 * 原理说明：
 * 1. RouterProvider：提供路由上下文，使整个应用支持路由功能
 * 2. 简化的应用结构，专注于核心功能
 */

function App() {
  return (
    <div className="App">
      {/* React Router 路由提供者 */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
