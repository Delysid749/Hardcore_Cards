import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { registerReq } from '../services';

const { Title, Text } = Typography;

/**
 * 注册页面组件
 * 
 * 参考原项目：RegisterComponent.vue
 * 简化版本，只包含核心字段：
 * 1. 邮箱（作为用户名）
 * 2. 密码
 * 3. 确认密码
 * 
 * 注册逻辑：
 * 1. 前端验证邮箱格式和密码一致性
 * 2. 调用后端注册接口
 * 3. 注册成功后跳转登录页面
 */

interface RegisterForm {
  username: string;  // 邮箱作为用户名
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * 处理注册提交 - 参考原项目RegisterComponent.vue的register方法
   */
  const handleRegister = async (values: RegisterForm) => {
    setLoading(true);
    try {
      // 邮箱格式验证 - 与原项目保持一致
      const emailRegex = /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
      
      if (!emailRegex.test(values.username)) {
        message.error('邮箱格式错误');
        return;
      }

      // 密码长度验证 - 与原项目保持一致
      if (values.password.length < 6 || values.password.length > 50) {
        message.error('密码长度应在6-50字符之间');
        return;
      }

      // 构建注册数据 - 与后端RegisterUserDTO完全匹配
      const registerData = {
        username: values.username,  // 邮箱作为用户名
        password: values.password   // 密码（registerReq函数会自动添加rsaUuid并加密密码）
      };

      // 调用注册接口，registerReq函数会自动处理RSA加密
      const response = await registerReq(registerData);
      
      message.success('注册成功！请登录您的账户');
      
      // 跳转到登录页 - 与原项目保持一致
      navigate('/login');
      
    } catch (error: any) {
      console.error('注册失败:', error);
      message.error(error.response?.data?.msg || error.msg || '注册失败，请检查输入信息');
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
          {/* 邮箱字段 - 作为用户名 */}
          <Form.Item
            name="username"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="请输入邮箱地址"
            />
          </Form.Item>

          {/* 密码字段 */}
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, max: 50, message: '密码长度为6-50个字符！' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="请输入密码"
            />
          </Form.Item>

          {/* 确认密码字段 */}
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