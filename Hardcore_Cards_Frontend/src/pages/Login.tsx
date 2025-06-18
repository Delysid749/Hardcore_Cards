import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, message, Divider, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, verifyToken } from '../store/slices/authSlice';

const { Title, Text } = Typography;

/**
 * 登录页面组件
 * 
 * 原理说明：
 * 1. 使用Redux管理登录状态，支持全局状态管理
 * 2. 集成RSA加密功能，确保密码传输安全
 * 3. OAuth2.0认证流程，与后端完全兼容
 * 4. 自动Token验证和刷新机制
 * 5. 完善的错误处理和用户提示
 * 
 * 登录流程：
 * 1. 获取RSA公钥加密密码
 * 2. 发送OAuth2.0认证请求
 * 3. 保存Token并获取用户信息
 * 4. 跳转到主页面
 */

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux状态
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

  /**
   * 页面初始化检查登录状态
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('access_token');
      
      if (accessToken) {
        try {
          // 验证Token有效性并获取用户信息
          await dispatch(verifyToken()).unwrap();
          navigate('/home', { replace: true });
        } catch (error) {
          // Token无效，清除本地存储
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          console.log('Token验证失败，需要重新登录');
        }
      }
      
      setPageLoading(false);
    };

    checkAuthStatus();
  }, [dispatch, navigate]);

  /**
   * 处理登录表单提交
   */
  const handleLogin = async (values: LoginFormValues) => {
    try {
      // 使用Redux action处理登录
      await dispatch(login({
        username: values.username.trim(),
        password: values.password
      })).unwrap();
      
      message.success('登录成功，欢迎回来！');
      
      // 跳转到主页
      navigate('/home', { replace: true });
      
    } catch (error: any) {
      console.error('登录失败:', error);
      
      // 处理不同类型的错误
      let errorMessage = '登录失败，请重试';
      
      if (error?.msg) {
        errorMessage = error.msg;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // 特殊错误处理
      if (errorMessage.includes('用户名或密码错误')) {
        errorMessage = '用户名或密码错误，请检查后重试';
      } else if (errorMessage.includes('网络')) {
        errorMessage = '网络连接失败，请检查网络后重试';
      } else if (errorMessage.includes('服务器')) {
        errorMessage = '服务器暂时无法访问，请稍后重试';
      }
      
      message.error(errorMessage);
    }
  };

  /**
   * 处理表单验证失败
   */
  const handleValidationFailed = (errorInfo: any) => {
    console.log('表单验证失败:', errorInfo);
    message.warning('请检查输入信息');
  };

  // 页面加载中
  if (pageLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Spin 
          size="large" 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />}
        />
        <Text style={{ color: 'white', marginLeft: 16, fontSize: 16 }}>
          正在检查登录状态...
        </Text>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* 左侧介绍区域 */}
      <div style={{ 
        flex: 1, 
        maxWidth: '500px', 
        textAlign: 'center',
        color: 'white',
        marginRight: '60px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
        <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
          Hardcore Cards
        </Title>
        <Title level={3} style={{ color: 'white', fontWeight: 'normal', opacity: 0.9 }}>
          高效管理你的想法、工作、生活
        </Title>
        <Text style={{ color: 'white', fontSize: '16px', opacity: 0.8 }}>
          强大的看板管理工具，让团队协作更高效
        </Text>
      </div>

      {/* 右侧登录表单 */}
      <Card 
        style={{ 
          width: 420, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>👋</div>
          <Title level={2} style={{ margin: 0 }}>欢迎回来</Title>
          <Text type="secondary">请登录您的账户</Text>
        </div>

        <Form
          form={form}
          name="login"
          size="large"
          onFinish={handleLogin}
          onFinishFailed={handleValidationFailed}
          autoComplete="off"
          layout="vertical"
          disabled={loading}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 3, message: '用户名至少3个字符！' },
              { 
                pattern: /^[a-zA-Z0-9@._-]+$/, 
                message: '用户名只能包含字母、数字、@、.、_、-' 
              }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名或邮箱"
              autoComplete="username"
              maxLength={50}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码至少6个字符！' },
              { max: 50, message: '密码不能超过50个字符！' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码"
              autoComplete="current-password"
              maxLength={50}
            />
          </Form.Item>

          {/* 显示登录错误信息 */}
          {error && (
            <div style={{ 
              marginBottom: '16px', 
              padding: '8px 12px', 
              background: '#fff2f0', 
              border: '1px solid #ffccc7',
              borderRadius: '6px',
              color: '#ff4d4f',
              fontSize: '14px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{ 
                height: '44px', 
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">还没有账户？</Text>
        </Divider>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button 
            block 
            size="large" 
            onClick={() => navigate('/register')}
            disabled={loading}
          >
            注册新账户
          </Button>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/forgot-password">
              <Text type="secondary">忘记密码？</Text>
            </Link>
          </div>
        </Space>

        {/* 开发环境提示 */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginTop: '20px', 
            padding: '12px', 
            background: '#f6f8fa', 
            borderRadius: '6px',
            fontSize: '12px',
            color: '#666'
          }}>
            <Text type="secondary">
              💡 开发提示：确保后端服务已启动 (http://localhost:9201)
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login; 