import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { registerReq, sendEmailCodeReq, validateUsernameReq, validateEmailReq } from '../services';

const { Title, Text } = Typography;

/**
 * 注册页面组件
 * 
 * 原理说明：
 * 1. 完全按照原Vue项目的注册逻辑和接口调用方式
 * 2. 包含邮箱验证码验证功能
 * 3. 用户名和邮箱唯一性验证
 * 4. 密码确认验证
 * 
 * 对应原项目：
 * - RegisterComponent.vue
 */

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  emailCode: string;
  nickname: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  /**
   * 发送邮箱验证码 - 与原项目保持一致
   */
  const handleSendEmailCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        message.error('请先输入邮箱地址');
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        message.error('请输入有效的邮箱地址');
        return;
      }

      setSendingCode(true);

      // 先验证邮箱是否已存在
      await validateEmailReq({ email });

      // 发送验证码
      await sendEmailCodeReq({ email });
      
      message.success('验证码已发送到您的邮箱');
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error: any) {
      message.error(error.msg || '发送验证码失败');
    } finally {
      setSendingCode(false);
    }
  };

  /**
   * 验证用户名唯一性
   */
  const validateUsername = async (username: string) => {
    if (!username) return;
    try {
      await validateUsernameReq({ username });
    } catch (error: any) {
      throw new Error(error.msg || '用户名已存在');
    }
  };

  /**
   * 处理注册提交 - 与原项目RegisterComponent.vue保持一致
   */
  const handleRegister = async (values: RegisterForm) => {
    setLoading(true);
    try {
      // 构建注册数据 - 与原项目保持一致
      const registerData = {
        username: values.username,
        password: values.password,
        email: values.email,
        nickname: values.nickname,
        emailCode: values.emailCode
      };

      await registerReq(registerData);
      
      message.success('注册成功！请登录您的账户');
      
      // 跳转到登录页
      navigate('/login');
      
    } catch (error: any) {
      console.error('注册失败:', error);
      message.error(error.msg || '注册失败，请检查输入信息');
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
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🚀</div>
        <Title level={1} style={{ color: 'white', marginBottom: '16px' }}>
          加入我们
        </Title>
        <Title level={3} style={{ color: 'white', fontWeight: 'normal', opacity: 0.9 }}>
          开始您的高效工作之旅
        </Title>
        <Text style={{ color: 'white', fontSize: '16px', opacity: 0.8 }}>
          创建账户，体验强大的看板管理功能
        </Text>
      </div>

      {/* 右侧注册表单 */}
      <Card 
        style={{ 
          width: 450, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
          <Title level={2} style={{ margin: 0 }}>创建新账户</Title>
          <Text type="secondary">填写以下信息完成注册</Text>
        </div>

        <Form
          form={form}
          name="register"
          size="large"
          onFinish={handleRegister}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名！' },
              { min: 3, max: 20, message: '用户名长度为3-20个字符！' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线！' },
              { validator: (_, value) => validateUsername(value) }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入用户名"
            />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[
              { required: true, message: '请输入昵称！' },
              { min: 2, max: 10, message: '昵称长度为2-10个字符！' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="请输入昵称"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址！' },
              { type: 'email', message: '请输入有效的邮箱地址！' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="请输入邮箱地址"
            />
          </Form.Item>

          <Form.Item
            name="emailCode"
            label="邮箱验证码"
            rules={[
              { required: true, message: '请输入邮箱验证码！' },
              { len: 6, message: '验证码为6位数字！' }
            ]}
          >
            <Input
              placeholder="请输入验证码"
              suffix={
                <Button 
                  type="link" 
                  onClick={handleSendEmailCode}
                  disabled={countdown > 0 || sendingCode}
                  loading={sendingCode}
                  style={{ padding: 0 }}
                >
                  {countdown > 0 ? `${countdown}s后重发` : '发送验证码'}
                </Button>
              }
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, max: 20, message: '密码长度为6-20个字符！' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码！' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请再次输入密码"
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
              注册账户
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">已有账户？</Text>
        </Divider>

        <Button 
          block 
          size="large" 
          onClick={() => navigate('/login')}
        >
          立即登录
        </Button>
      </Card>
    </div>
  );
};

export default Register; 