import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, message, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { loginReq, testToken } from '../services';

const { Title, Text } = Typography;

/**
 * 登录页面组件
 * 
 * 原理说明：
 * 1. 完全按照原Vue项目的登录逻辑和接口调用方式
 * 2. 使用OAuth2 password模式进行认证
 * 3. 成功后保存access_token和refresh_token
 * 4. 自动跳转到主页面
 * 
 * 对应原项目：
 * - Index.vue + LoginRegister.vue + LoginComponent.vue
 */

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 检查是否已登录
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      testToken().then(() => {
        navigate('/home');
      }).catch(() => {
        // Token无效，清除
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      });
    }
  }, [navigate]);

  /**
   * 处理登录提交 - 与原项目LoginComponent.vue保持一致
   */
  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 按照原项目的OAuth2认证方式
      const loginData = {
        grant_type: "password",
        client_id: "fic",
        client_secret: "fic",
        username: values.username,
        password: values.password
      };

      const response = await loginReq(loginData);
      
      // 保存Token - 与原项目保持一致
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      
      message.success('登录成功！');
      
      // 跳转到主页
      navigate('/home');
      
    } catch (error: any) {
      console.error('登录失败:', error);
      message.error(error.msg || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

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
          width: 400, 
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
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 3, message: '用户名至少3个字符！' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码至少6个字符！' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{ height: '44px', fontSize: '16px' }}
            >
              登录
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
          >
            注册新账户
          </Button>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/forgot-password">
              <Text type="secondary">忘记密码？</Text>
            </Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login; 