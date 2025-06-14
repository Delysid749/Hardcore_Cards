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
    <div style={{ padding: '0 24px' }}>
      {/* 欢迎区域 */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          🎯 欢迎使用 Hardcore Cards
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          强大的看板管理工具，让团队协作更高效
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
      <Row gutter={[24, 24]}>
        {featureCards.map((card, index) => (
          <Col xs={24} md={12} key={index}>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={
                isAuthenticated 
                  ? [
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={card.action}
                        key="action"
                      >
                        {card.buttonText}
                      </Button>
                    ]
                  : []
              }
            >
              <Card.Meta
                avatar={card.icon}
                title={<Title level={4}>{card.title}</Title>}
                description={
                  <Paragraph style={{ marginBottom: 0 }}>
                    {card.description}
                  </Paragraph>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 特性介绍 */}
      <Card style={{ marginTop: '48px' }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: '32px' }}>
          ✨ 核心特性
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>🚀 现代化技术栈</Title>
              <Paragraph>
                基于 React 18 + TypeScript + Ant Design 构建，
                提供优秀的开发体验和用户体验
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>🎨 美观的界面设计</Title>
              <Paragraph>
                采用现代化的设计语言，简洁美观的界面，
                支持主题切换和响应式布局
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>⚡ 实时协作</Title>
              <Paragraph>
                支持多人实时协作编辑，自动同步数据，
                让团队协作更加高效便捷
              </Paragraph>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home; 