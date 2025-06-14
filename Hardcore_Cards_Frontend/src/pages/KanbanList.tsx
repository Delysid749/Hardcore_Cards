import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const KanbanList: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>我的看板</Title>
      <p>看板列表功能正在开发中...</p>
    </div>
  );
};

export default KanbanList; 