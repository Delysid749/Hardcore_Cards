import React from 'react';
import { Button, Card, Typography, Space } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import { ReactPlugin } from '@stagewise-plugins/react';
import './App.css';

const { Title, Paragraph } = Typography;

function App() {
  return (
    <div className="App">
      {/* Stagewise Toolbar - 只在开发模式下显示 */}
      <StagewiseToolbar 
        config={{
          plugins: [ReactPlugin]
        }}
      />
      
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Title level={1} style={{ textAlign: 'center', marginBottom: '32px' }}>
          🎯 Hardcore Cards
        </Title>
        
        <Card 
          title="项目脚手架搭建完成" 
          style={{ marginBottom: '24px', fontSize: '16px' }}
          extra={<Button type="primary" icon={<PlusOutlined />}>开始使用</Button>}
        >
          <Paragraph>
            恭喜！React + TypeScript + Ant Design 项目脚手架已经成功搭建完成。
          </Paragraph>
          
          <Title level={4}>✅ 已完成的配置：</Title>
          <ul>
            <li><strong>React 19</strong> - 最新版本的React框架</li>
            <li><strong>TypeScript</strong> - 类型安全的JavaScript超集</li>
            <li><strong>Vite</strong> - 快速的构建工具</li>
            <li><strong>Ant Design</strong> - 企业级UI组件库</li>
            <li><strong>Axios</strong> - HTTP请求库</li>
            <li><strong>React Router</strong> - 路由管理</li>
            <li><strong>Redux Toolkit</strong> - 状态管理</li>
            <li><strong>React Hook Form</strong> - 表单处理</li>
            <li><strong>拖拽功能</strong> - @hello-pangea/dnd</li>
            <li><strong>日期处理</strong> - dayjs</li>
            <li><strong>🆕 Stagewise工具栏</strong> - AI驱动的开发工具</li>
          </ul>
          
          <Title level={4}>📁 项目结构：</Title>
          <ul>
            <li><code>src/components/</code> - 可复用组件</li>
            <li><code>src/pages/</code> - 页面组件</li>
            <li><code>src/hooks/</code> - 自定义React钩子</li>
            <li><code>src/services/</code> - API服务</li>
            <li><code>src/store/</code> - Redux状态管理</li>
            <li><code>src/types/</code> - TypeScript类型定义</li>
            <li><code>src/utils/</code> - 工具函数</li>
            <li><code>src/constants/</code> - 常量定义</li>
          </ul>
          
          <Title level={4}>🔧 Stagewise工具栏：</Title>
          <Paragraph>
            现在您可以使用Stagewise工具栏来：
          </Paragraph>
          <ul style={{ color: 'green' }}>
            <li>选择页面元素并添加注释</li>
            <li>让AI代理基于上下文进行代码修改</li>
            <li>连接前端UI与代码编辑器中的AI代理</li>
            <li>提升开发效率和代码质量</li>
          </ul>
        </Card>
        
        <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
          <Button type="primary" size="large" icon={<UserOutlined />}>
            用户管理
          </Button>
          <Button type="default" size="large" icon={<PlusOutlined />}>
            看板管理
          </Button>
        </Space>
      </div>
    </div>
  );
}

export default App;
