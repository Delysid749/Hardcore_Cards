import React from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  ProjectOutlined, 
  UserOutlined, 
  LogoutOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { useAppDispatch, useUser, useIsAuthenticated, useSidebarCollapsed } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { toggleSidebar } from '../store/slices/uiSlice';

const { Header, Sider, Content } = AntLayout;

/**
 * 主布局组件
 * 
 * 原理说明：
 * 1. 使用Ant Design的Layout组件构建标准后台布局
 * 2. Header：顶部导航栏，包含用户信息和操作
 * 3. Sider：左侧导航菜单，可折叠
 * 4. Content：主内容区域，通过Outlet渲染子路由
 * 5. 响应式设计：支持移动端适配
 * 
 * 对应原项目：
 * 原项目可能没有统一的布局组件
 * 我们提供了完整的后台管理系统布局
 */

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const collapsed = useSidebarCollapsed();

  /**
   * 导航菜单配置
   * 
   * 原理说明：
   * 1. 根据路由路径高亮当前菜单项
   * 2. 图标 + 文字的标准菜单设计
   * 3. 支持嵌套菜单结构
   */
  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/kanbans',
      icon: <ProjectOutlined />,
      label: '我的看板',
    },
    {
      key: '/invitation',
      icon: <MailOutlined />,
      label: '邀请管理',
    },
  ];

  /**
   * 用户下拉菜单
   * 
   * 原理说明：
   * 用户头像点击后显示的操作菜单
   */
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  /**
   * 处理菜单点击
   */
  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  /**
   * 处理用户登出
   * 
   * 原理说明：
   * 1. 清除Redux中的用户状态
   * 2. 清除localStorage中的token
   * 3. 重定向到登录页
   */
  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  /**
   * 切换侧边栏折叠状态
   */
  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      {/* 左侧导航栏 */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo区域 */}
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {collapsed ? '🎯' : '🎯 Hardcore Cards'}
        </div>
        
        {/* 导航菜单 */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      {/* 右侧内容区域 */}
      <AntLayout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        {/* 顶部导航栏 */}
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          {/* 左侧：折叠按钮 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggleSidebar}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />

          {/* 右侧：用户信息 */}
          {isAuthenticated && user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  src={user.avatar} 
                  icon={<UserOutlined />}
                  size="small"
                />
                <span>{user.nickname || user.username}</span>
              </Space>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </Header>

        {/* 主内容区域 */}
        <Content style={{ 
          margin: '24px', 
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          minHeight: 'calc(100vh - 112px)'
        }}>
          {/* 渲染子路由组件 */}
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 