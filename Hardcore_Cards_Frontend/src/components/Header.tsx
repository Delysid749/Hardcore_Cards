import React from 'react';
import { Layout, Avatar, Dropdown, Button, Space, Typography, message } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  HomeOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useIsAuthenticated } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

/**
 * 顶栏组件
 * 
 * 原理说明：
 * 1. 显示应用标题和用户信息
 * 2. 提供用户下拉菜单：个人中心、设置、登出等
 * 3. 根据登录状态显示不同的内容
 * 4. 响应式设计，适配不同屏幕尺寸
 * 5. 集成Redux状态管理，实时更新用户信息
 */

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Redux状态
  const isAuthenticated = useIsAuthenticated();
  const user = useAppSelector(state => state.auth.user);

  /**
   * 处理登出操作
   */
  const handleLogout = () => {
    dispatch(logout());
    message.success('已安全退出');
    navigate('/login');
  };

  /**
   * 用户下拉菜单配置
   */
  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div style={{ padding: '8px 0' }}>
          <UserOutlined style={{ marginRight: '8px' }} />
          个人中心
        </div>
      ),
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      label: (
        <div style={{ padding: '8px 0', color: '#ff4d4f' }}>
          <LogoutOutlined style={{ marginRight: '8px' }} />
          退出登录
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  /**
   * 导航菜单项
   */
  const navigationItems = [
    {
      key: 'home',
      label: '首页',
      icon: <HomeOutlined />,
      path: '/home',
    },
    {
      key: 'kanbans',
      label: '看板',
      icon: <ProjectOutlined />,
      path: '/kanbans',
    },
  ];

  /**
   * 判断当前路由是否激活
   */
  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <AntHeader 
      style={{ 
        background: '#fff', 
        borderBottom: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: '0 24px',
        height: '64px',
        lineHeight: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: '100%'
      }}>
        {/* 左侧：Logo和导航 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* 应用Logo和标题 */}
          <div 
            className="logo-container"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              marginRight: '40px'
            }}
            onClick={() => navigate('/home')}
          >
            <div style={{ 
              fontSize: '24px', 
              marginRight: '12px',
              background: 'linear-gradient(135deg, #1890ff, #722ed1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              🎯
            </div>
            <Text strong style={{ 
              fontSize: '18px', 
              color: '#262626',
              fontWeight: 'bold'
            }}>
              Hardcore Cards
            </Text>
          </div>

          {/* 导航菜单 - 仅登录用户显示 */}
          {isAuthenticated && (
            <Space size="large">
              {navigationItems.map(item => (
                <Button
                  key={item.key}
                  type={isActiveRoute(item.path) ? 'primary' : 'text'}
                  icon={item.icon}
                  onClick={() => navigate(item.path)}
                  style={{
                    border: 'none',
                    boxShadow: 'none',
                    fontWeight: isActiveRoute(item.path) ? 'bold' : 'normal'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Space>
          )}
        </div>

        {/* 右侧：用户信息区域 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated && user ? (
            // 已登录用户显示
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
              trigger={['click']}
            >
              <div className="user-info-container" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'background-color 0.2s'
              }}>
                <Avatar 
                  size={32}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  style={{ 
                    marginRight: '8px',
                    border: '2px solid #f0f0f0'
                  }}
                />
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  lineHeight: '1.2'
                }}>
                  <Text strong style={{ fontSize: '14px', color: '#262626' }}>
                    {user.nickname || user.username}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    @{user.username}
                  </Text>
                </div>
              </div>
            </Dropdown>
          ) : (
            // 未登录用户显示
            <Space>
              <Button 
                type="text" 
                onClick={() => navigate('/login')}
              >
                登录
              </Button>
              <Button 
                type="primary" 
                onClick={() => navigate('/register')}
              >
                注册
              </Button>
            </Space>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header; 