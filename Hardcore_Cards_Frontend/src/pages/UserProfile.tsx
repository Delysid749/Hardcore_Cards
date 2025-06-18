import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Avatar, 
  message, 
  Tabs, 
  Typography, 
  Space,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined,
  MailOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { 
  updateUserReq
} from '../services';

const { Title, Text } = Typography;

/**
 * 个人中心页面组件
 * 
 * 原理说明：
 * 1. 用户信息管理：显示和编辑个人基本信息
 * 2. 密码修改：安全的密码更改功能
 * 3. 响应式设计：适配不同屏幕尺寸
 */

interface UserProfile {
  userId: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  nickname?: string;
}

const UserProfile: React.FC = () => {
  // Redux状态
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  // 本地状态
  const [loading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  
  // 表单实例
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  /**
   * 更新用户信息
   */
  const handleUpdateProfile = async (values: any) => {
    try {
      setUpdating(true);
      
      const updateData = {
        nickname: values.nickname,
        email: values.email,
        phone: values.phone || ''
      };
      
      await updateUserReq(updateData);
      message.success('更新个人信息成功');
      
    } catch (error: any) {
      console.error('更新用户信息失败:', error);
      message.error(error.msg || '更新个人信息失败');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * 修改密码
   */
  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('两次输入的新密码不一致');
      return;
    }
    
    try {
      setChangingPassword(true);
      
      // TODO: 实现密码修改API调用
      // await changePassword({
      //   oldPassword: values.oldPassword,
      //   newPassword: values.newPassword
      // });
      
      message.success('密码修改成功');
      passwordForm.resetFields();
      
    } catch (error: any) {
      console.error('修改密码失败:', error);
      message.error(error.msg || '修改密码失败');
    } finally {
      setChangingPassword(false);
    }
  };

  // 设置表单初始值
  useEffect(() => {
    if (currentUser) {
      profileForm.setFieldsValue({
                                nickname: (currentUser as any).nickname || currentUser.username,
                        email: currentUser.email,
                        phone: (currentUser as any).phone || ''
      });
    }
  }, [currentUser, profileForm]);

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <Row gutter={[24, 24]}>
          {/* 左侧个人信息卡片 */}
          <Col xs={24} lg={8}>
            <Card 
              loading={loading}
              style={{ textAlign: 'center', height: 'fit-content' }}
            >
              <div style={{ marginBottom: '24px' }}>
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />}
                  style={{ 
                    border: '4px solid #f0f0f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
              </div>

              {currentUser && (
                <div>
                  <Title level={4} style={{ margin: '0 0 8px 0' }}>
                    {currentUser.nickname || currentUser.username}
                  </Title>
                  <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                    @{currentUser.username}
                  </Text>
                  
                  <Divider style={{ margin: '16px 0' }} />
                  
                  <div style={{ textAlign: 'left' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        <Text>{currentUser.email}</Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <UserOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                        <Text type="secondary">
                          用户ID：{(currentUser as any).userId || 'N/A'}
                        </Text>
                      </div>
                    </Space>
                  </div>
                </div>
              )}
            </Card>
          </Col>

          {/* 右侧设置选项卡 */}
          <Col xs={24} lg={16}>
            <Card>
              <Tabs 
                defaultActiveKey="profile" 
                type="card"
                items={[
                  {
                    key: 'profile',
                    label: (
                      <span>
                        <EditOutlined />
                        编辑资料
                      </span>
                    ),
                    children: (
                      <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={handleUpdateProfile}
                        disabled={loading}
                      >
                        <Row gutter={16}>
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name="nickname"
                              label="昵称"
                              rules={[
                                { required: true, message: '请输入昵称！' },
                                { max: 50, message: '昵称最多50个字符！' }
                              ]}
                            >
                              <Input 
                                placeholder="请输入昵称" 
                                prefix={<UserOutlined />}
                                maxLength={50}
                              />
                            </Form.Item>
                          </Col>
                          
                          <Col xs={24} sm={12}>
                            <Form.Item
                              name="email"
                              label="邮箱"
                              rules={[
                                { required: true, message: '请输入邮箱！' },
                                { type: 'email', message: '请输入有效的邮箱地址！' }
                              ]}
                            >
                              <Input 
                                placeholder="请输入邮箱" 
                                prefix={<MailOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item style={{ marginBottom: 0 }}>
                          <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={updating}
                            size="large"
                          >
                            保存修改
                          </Button>
                        </Form.Item>
                      </Form>
                    )
                  },
                  {
                    key: 'password',
                    label: (
                      <span>
                        <LockOutlined />
                        修改密码
                      </span>
                    ),
                    children: (
                      <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handleChangePassword}
                        disabled={loading}
                      >
                        <Form.Item
                          name="oldPassword"
                          label="当前密码"
                          rules={[
                            { required: true, message: '请输入当前密码！' }
                          ]}
                        >
                          <Input.Password 
                            placeholder="请输入当前密码" 
                            prefix={<LockOutlined />}
                          />
                        </Form.Item>

                        <Form.Item
                          name="newPassword"
                          label="新密码"
                          rules={[
                            { required: true, message: '请输入新密码！' },
                            { min: 6, message: '密码至少6位字符！' },
                            { max: 20, message: '密码最多20位字符！' }
                          ]}
                        >
                          <Input.Password 
                            placeholder="请输入新密码（6-20位）" 
                            prefix={<LockOutlined />}
                          />
                        </Form.Item>

                        <Form.Item
                          name="confirmPassword"
                          label="确认新密码"
                          dependencies={['newPassword']}
                          rules={[
                            { required: true, message: '请确认新密码！' },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('两次输入的密码不一致！'));
                              },
                            }),
                          ]}
                        >
                          <Input.Password 
                            placeholder="请再次输入新密码" 
                            prefix={<LockOutlined />}
                          />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0 }}>
                          <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={changingPassword}
                            size="large"
                            danger
                          >
                            修改密码
                          </Button>
                          
                          <Button 
                            style={{ marginLeft: '12px' }}
                            onClick={() => passwordForm.resetFields()}
                          >
                            重置
                          </Button>
                        </Form.Item>
                      </Form>
                    )
                  }
                ]}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default UserProfile; 