import React from 'react';
import { Card, Typography, Button, Space, Row, Col } from 'antd';
import { PlusOutlined, ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated } from '../store/hooks';

const { Title, Paragraph } = Typography;

/**
 * 首页组件
 * 
 * 原理说明：
 * 1. 作为应用的入口页面，展示主要功能
 * 2. 根据登录状态显示不同内容
 * 3. 提供快速导航到主要功能的入口
 * 
 * 对应原项目：
 * 类似原项目的 Index.vue 或欢迎页面
 */

const Home: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  /**
   * 功能卡片数据
   */
  const featureCards = [
    {
      title: '看板管理',
      description: '创建和管理您的项目看板，支持多人协作',
      icon: <ProjectOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      action: () => navigate('/kanbans'),
      buttonText: '进入看板',
    },
    {
      title: '团队协作',
      description: '邀请团队成员，实时协作编辑看板内容',
      icon: <UserOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      action: () => navigate('/invitation'),
      buttonText: '邀请管理',
    },
  ];

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '40px 24px',
      minHeight: 'calc(100vh - 200px)'
    }}>
      {/* 欢迎区域 */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <Title level={1} style={{ 
          marginBottom: '24px', 
          fontSize: '48px',
          background: 'linear-gradient(135deg, #1890ff, #722ed1)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🎯 欢迎使用 Hardcore Cards
        </Title>
        <Paragraph style={{ 
          fontSize: '20px', 
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          强大的看板管理工具，让团队协作更高效。支持拖拽排序、实时协作、多人共享，打造现代化的项目管理体验。
        </Paragraph>
        
        {!isAuthenticated && (
          <Space size="large" style={{ marginTop: '24px' }}>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => navigate('/login')}
            >
              立即登录
            </Button>
            <Button 
              size="large" 
              onClick={() => navigate('/register')}
            >
              注册账号
            </Button>
          </Space>
        )}
      </div>

      {/* 功能介绍 */}
      <Row gutter={[32, 32]} style={{ marginBottom: '80px' }}>
        {featureCards.map((card, index) => (
          <Col xs={24} md={12} key={index}>
            <Card
              hoverable
              style={{ 
                height: '100%',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ padding: '32px' }}
              actions={
                isAuthenticated 
                  ? [
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={card.action}
                        key="action"
                        size="large"
                        style={{ borderRadius: '8px' }}
                      >
                        {card.buttonText}
                      </Button>
                    ]
                  : []
              }
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '20px' }}>
                  {card.icon}
                </div>
                <Title level={3} style={{ marginBottom: '16px', color: '#262626' }}>
                  {card.title}
                </Title>
                <Paragraph style={{ 
                  marginBottom: 0, 
                  color: '#666',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  {card.description}
                </Paragraph>
              </div>
            </Card>
          </Col>
        ))}
      </Row>


    </div>
  );
};

export default Home; 