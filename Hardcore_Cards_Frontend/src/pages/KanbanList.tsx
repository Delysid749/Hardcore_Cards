import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  ColorPicker, 
  Select, 
  message, 
  Spin, 
  Typography, 
  Divider,
  Row,
  Col,
  Space,
  Avatar
} from 'antd';
import { PlusOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { allKanban, addKanban, collectReq } from '../services';

const { Title, Text } = Typography;
const { Meta } = Card;

/**
 * 看板列表页面组件
 * 
 * 原理说明：
 * 1. 完全按照原Vue项目的KanbanHome.vue逻辑和接口调用方式
 * 2. 分为收藏看板和全部看板两个区域
 * 3. 支持创建新看板功能
 * 4. 支持看板收藏/取消收藏
 * 
 * 对应原项目：
 * - KanbanHome.vue
 */

interface KanbanInfo {
  kanbanId: number;
  title: string;
  color: string;
  type: number;
  collected: boolean;
  member: any[];
  createdAt: string;
}

interface NewKanbanForm {
  title: string;
  color: string;
  type: number;
}

const KanbanList: React.FC = () => {
  const [collected, setCollected] = useState<KanbanInfo[]>([]);
  const [other, setOther] = useState<KanbanInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKanbanShow, setNewKanbanShow] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // 获取随机颜色 - 与原项目保持一致
  const getRandomColor = () => '#' + Math.random().toString(16).substr(2, 6);

  /**
   * 刷新看板列表 - 与原项目refresh方法保持一致
   */
  const refresh = async () => {
    try {
      setLoading(true);
      const response = await allKanban();
      console.log(response);
      
      // 分离收藏和全部看板 - 与原项目逻辑一致
      const collectedKanbans = response.data.filter((item: KanbanInfo) => item.collected);
      setCollected(collectedKanbans);
      setOther(response.data);
    } catch (error: any) {
      console.error('获取看板列表失败:', error);
      message.error(error.msg || '获取看板列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    refresh();
  }, []);

  /**
   * 创建新看板 - 与原项目commit方法保持一致
   */
  const handleCreateKanban = async (values: NewKanbanForm) => {
    try {
      await addKanban(values);
      message.success('看板创建成功');
      setNewKanbanShow(false);
      form.resetFields();
      
      // 刷新列表
      refresh();
    } catch (error: any) {
      console.error('创建看板失败:', error);
      message.error(error.msg || '创建看板失败');
    }
  };

  /**
   * 切换看板收藏状态
   */
  const handleToggleCollect = async (kanbanId: number, collected: boolean, event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    try {
      await collectReq({ kanbanId, collected: !collected });
      message.success(collected ? '已取消收藏' : '已添加收藏');
      refresh();
    } catch (error: any) {
      console.error('收藏操作失败:', error);
      message.error(error.msg || '收藏操作失败');
    }
  };

  /**
   * 跳转到看板详情
   */
  const handleOpenKanban = (kanbanId: number) => {
    navigate(`/kanban/${kanbanId}`);
  };

  /**
   * 看板卡片组件
   */
  const KanbanCard: React.FC<{ kanban: KanbanInfo }> = ({ kanban }) => (
    <Card
      hoverable
      style={{ 
        width: 260, 
        marginBottom: 20,
        cursor: 'pointer',
        transition: 'transform 0.2s',
        border: `3px solid ${kanban.color}20`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      actions={[
        <Button 
          key="collect"
          type="text" 
          icon={kanban.collected ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
          onClick={(e) => handleToggleCollect(kanban.kanbanId, kanban.collected, e)}
        >
          {kanban.collected ? '已收藏' : '收藏'}
        </Button>
      ]}
      onClick={() => handleOpenKanban(kanban.kanbanId)}
    >
      <div style={{ 
        height: 8, 
        backgroundColor: kanban.color, 
        margin: '-24px -24px 16px -24px',
        borderRadius: '8px 8px 0 0'
      }} />
      
      <Meta
        title={
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            marginBottom: '8px',
            color: '#262626'
          }}>
            {kanban.title}
          </div>
        }
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="secondary">类型：{kanban.type === 1 ? '默认类型' : '其他类型'}</Text>
            </div>
            
            {kanban.member && kanban.member.length > 0 && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>团队成员：</Text>
                <Avatar.Group size="small" maxCount={3} style={{ marginLeft: 8 }}>
                  {kanban.member.map((member, index) => (
                    <Avatar 
                      key={index}
                      src={member.avatar}
                      size="small"
                    >
                      {member.nickname?.substring(0, 2) || member.username?.substring(0, 2)}
                    </Avatar>
                  ))}
                </Avatar.Group>
              </div>
            )}
            
            <Text type="secondary" style={{ fontSize: '12px' }}>
              创建时间：{new Date(kanban.createdAt).toLocaleDateString()}
            </Text>
          </Space>
        }
      />
    </Card>
  );

  return (
    <div style={{ padding: '5px 20px' }}>
      <Spin spinning={loading}>
        {/* 收藏看板区域 */}
        {collected.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <Title level={3}>⭐ 收藏</Title>
            <Divider />
            <Row gutter={[20, 20]}>
              {collected.map((kanban) => (
                <Col key={kanban.kanbanId}>
                  <KanbanCard kanban={kanban} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* 所有看板区域 */}
        <div>
          <Title level={3}>📋 所有看板</Title>
          <Divider />
          <Row gutter={[20, 20]}>
            {other.map((kanban) => (
              <Col key={kanban.kanbanId}>
                <KanbanCard kanban={kanban} />
              </Col>
            ))}
            
            {/* 新建看板卡片 */}
            <Col>
              <Card
                hoverable
                style={{ 
                  width: 260, 
                  marginBottom: 20, 
                  cursor: 'pointer',
                  border: '2px dashed #d9d9d9'
                }}
                onClick={() => setNewKanbanShow(true)}
              >
                <div style={{
                  width: '100%',
                  textAlign: 'center',
                  color: '#888',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '40px 0'
                }}>
                  <PlusOutlined style={{ fontSize: '40px', marginBottom: 16 }} />
                  <Text style={{ fontSize: '16px', color: '#888' }}>新建看板</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>

      {/* 新建看板弹窗 - 与原项目模态框保持一致 */}
      <Modal
        title="新建看板"
        open={newKanbanShow}
        onCancel={() => {
          setNewKanbanShow(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          onFinish={handleCreateKanban}
          layout="vertical"
          initialValues={{
            color: getRandomColor(),
            type: 1
          }}
        >
          <Form.Item
            name="title"
            label="看板标题"
            rules={[
              { required: true, message: '请输入看板标题！' },
              { max: 60, message: '标题最多60个字符！' }
            ]}
          >
            <Input placeholder="请输入看板标题" maxLength={60} />
          </Form.Item>

          <Form.Item
            name="color"
            label="主题颜色"
            rules={[{ required: true, message: '请选择主题颜色！' }]}
          >
            <ColorPicker showText />
          </Form.Item>

          <Form.Item
            name="type"
            label="看板类型"
            rules={[{ required: true, message: '请选择看板类型！' }]}
          >
            <Select placeholder="请选择看板类型">
              <Select.Option value={1}>默认类型</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setNewKanbanShow(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanList; 