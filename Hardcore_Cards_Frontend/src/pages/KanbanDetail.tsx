import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Spin, 
  Typography, 
  Space,
  Dropdown,
  Tag,
  Card,
  Empty,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  MoreOutlined, 
  DeleteOutlined,
  StarOutlined,
  StarFilled
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  kanbanContent, 
  addColumn, 
  deleteColumnReq,
  addCardReq,
  deleteCardReq,
  moveCardReq,
  moveReq,
  collectReq
} from '../services';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * 看板详情页面组件
 * 
 * 原理说明：
 * 1. 完全按照原Vue项目的KanbanContent.vue逻辑和接口调用方式
 * 2. 实现拖拽排序功能（列和卡片）
 * 3. 支持添加、编辑、删除列和卡片
 * 4. 实时更新和状态管理
 */

interface KanbanData {
  kanbanId: number;
  title: string;
  color: string;
  collected: boolean;
  columns: ColumnData[];
  cards: CardData[];
}

interface ColumnData {
  columnId: number;
  title: string;
  orderNum: number;
  kanbanId: number;
}

interface CardData {
  cardId: number;
  title: string;
  content?: string;
  columnId: number;
  orderNum: number;
  priority?: string;
  tags?: string[];
}

const KanbanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 状态管理
  const [kanbanData, setKanbanData] = useState<KanbanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addColumnShow, setAddColumnShow] = useState(false);
  const [addCardShow, setAddCardShow] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<number | null>(null);
  
  // 表单实例
  const [columnForm] = Form.useForm();
  const [cardForm] = Form.useForm();

  /**
   * 获取看板内容 - 与原项目kanbanContent方法保持一致
   */
  const fetchKanbanData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await kanbanContent(id);
      console.log('看板数据:', response);
      setKanbanData(response.data);
    } catch (error: any) {
      console.error('获取看板详情失败:', error);
      message.error(error.msg || '获取看板详情失败');
      navigate('/kanban');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchKanbanData();
  }, [id]);

  /**
   * 切换看板收藏状态
   */
  const handleToggleCollect = async () => {
    if (!kanbanData) return;
    
    try {
      await collectReq({ 
        kanbanId: kanbanData.kanbanId, 
        collected: !kanbanData.collected 
      });
      
      setKanbanData(prev => prev ? {
        ...prev,
        collected: !prev.collected
      } : null);
      
      message.success(kanbanData.collected ? '已取消收藏' : '已添加收藏');
    } catch (error: any) {
      message.error(error.msg || '操作失败');
    }
  };

  /**
   * 添加新列 - 与原项目保持一致
   */
  const handleAddColumn = async (values: any) => {
    if (!kanbanData) return;
    
    try {
      const columnData = {
        title: values.title,
        kanbanId: kanbanData.kanbanId,
        orderNum: kanbanData.columns.length
      };
      
      await addColumn(columnData);
      message.success('添加列成功');
      setAddColumnShow(false);
      columnForm.resetFields();
      
      // 刷新数据
      fetchKanbanData();
    } catch (error: any) {
      message.error(error.msg || '添加列失败');
    }
  };

  /**
   * 删除列
   */
  const handleDeleteColumn = async (columnId: number) => {
    try {
      await deleteColumnReq(columnId);
      message.success('删除列成功');
      fetchKanbanData();
    } catch (error: any) {
      message.error(error.msg || '删除列失败');
    }
  };

  /**
   * 添加新卡片
   */
  const handleAddCard = async (values: any) => {
    if (!kanbanData || !selectedColumnId) return;
    
    try {
      const cardsInColumn = kanbanData.cards.filter(card => card.columnId === selectedColumnId);
      
      const cardData = {
        title: values.title,
        content: values.content || '',
        columnId: selectedColumnId,
        orderNum: cardsInColumn.length
      };
      
      await addCardReq(cardData);
      message.success('添加卡片成功');
      setAddCardShow(false);
      cardForm.resetFields();
      setSelectedColumnId(null);
      
      // 刷新数据
      fetchKanbanData();
    } catch (error: any) {
      message.error(error.msg || '添加卡片失败');
    }
  };

  /**
   * 删除卡片
   */
  const handleDeleteCard = async (cardId: number) => {
    try {
      await deleteCardReq(cardId);
      message.success('删除卡片成功');
      fetchKanbanData();
    } catch (error: any) {
      message.error(error.msg || '删除卡片失败');
    }
  };

  /**
   * 拖拽结束处理 - 与原项目拖拽逻辑保持一致
   */
  const handleDragEnd = async (result: any) => {
    const { destination, source, type } = result;
    
    if (!destination || !kanbanData) return;
    
    // 如果位置没有变化，直接返回
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      if (type === 'COLUMN') {
        // 列拖拽
        const newColumns = Array.from(kanbanData.columns);
        const [reorderedColumn] = newColumns.splice(source.index, 1);
        newColumns.splice(destination.index, 0, reorderedColumn);
        
        // 更新本地状态
        setKanbanData(prev => prev ? { ...prev, columns: newColumns } : null);
        
        // 调用API更新顺序
        const moveData = {
          columnId: reorderedColumn.columnId,
          orderNum: destination.index
        };
        await moveReq(moveData);
        
      } else {
        // 卡片拖拽
        const sourceColumnId = parseInt(source.droppableId);
        const destColumnId = parseInt(destination.droppableId);
        
        const newCards = Array.from(kanbanData.cards);
        const draggedCard = newCards.find(card => card.columnId === sourceColumnId);
        
        if (!draggedCard) return;
        
        // 更新卡片的列ID和顺序
        draggedCard.columnId = destColumnId;
        draggedCard.orderNum = destination.index;
        
        // 更新本地状态
        setKanbanData(prev => prev ? { ...prev, cards: newCards } : null);
        
        // 调用API更新卡片位置
        const moveData = {
          cardId: draggedCard.cardId,
          columnId: destColumnId,
          orderNum: destination.index
        };
        await moveCardReq(moveData);
      }
      
    } catch (error: any) {
      message.error('移动失败');
      // 重新获取数据恢复状态
      fetchKanbanData();
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!kanbanData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Empty description="看板不存在" />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 看板头部 */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: '1px solid #f0f0f0',
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '4px', 
              height: '32px', 
              backgroundColor: kanbanData.color,
              borderRadius: '2px'
            }} />
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              {kanbanData.title}
            </Title>
          </div>
          
          <Space size="middle">
            <Button 
              type="text" 
              icon={kanbanData.collected ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={handleToggleCollect}
            >
              {kanbanData.collected ? '已收藏' : '收藏'}
            </Button>
            
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setAddColumnShow(true)}
            >
              添加列
            </Button>
          </Space>
        </div>
      </div>

      {/* 看板内容区域 */}
      <div style={{ 
        flex: 1, 
        padding: '24px', 
        overflow: 'auto',
        background: '#f5f5f5'
      }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns" direction="horizontal" type="COLUMN">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ 
                  display: 'flex', 
                  gap: '20px',
                  minHeight: '500px'
                }}
              >
                {kanbanData.columns
                  .sort((a, b) => a.orderNum - b.orderNum)
                  .map((column, index) => (
                  <Draggable key={column.columnId} draggableId={`column-${column.columnId}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          width: '300px',
                          flexShrink: 0
                        }}
                      >
                        {/* 列组件 */}
                        <Card
                          size="small"
                          style={{ 
                            background: 'white',
                            boxShadow: snapshot.isDragging ? '0 8px 32px rgba(0,0,0,0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                            transform: snapshot.isDragging ? 'rotate(5deg)' : 'none'
                          }}
                          title={
                            <div 
                              {...provided.dragHandleProps}
                              style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                cursor: 'grab'
                              }}
                            >
                              <Text strong>{column.title}</Text>
                              <Dropdown
                                menu={{
                                  items: [
                                    {
                                      key: 'addCard',
                                      label: '添加卡片',
                                      icon: <PlusOutlined />,
                                      onClick: () => {
                                        setSelectedColumnId(column.columnId);
                                        setAddCardShow(true);
                                      }
                                    },
                                    {
                                      key: 'deleteColumn',
                                      label: '删除列',
                                      icon: <DeleteOutlined />,
                                      danger: true,
                                      onClick: () => {
                                        Modal.confirm({
                                          title: '确认删除',
                                          content: `确定要删除列"${column.title}"吗？`,
                                          okText: '确定',
                                          cancelText: '取消',
                                          onOk: () => handleDeleteColumn(column.columnId),
                                        });
                                      }
                                    }
                                  ]
                                }}
                                trigger={['click']}
                              >
                                <Button type="text" size="small" icon={<MoreOutlined />} />
                              </Dropdown>
                            </div>
                          }
                        >
                          <Droppable droppableId={`${column.columnId}`} type="CARD">
                            {(provided, snapshot) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                  minHeight: '400px',
                                  background: snapshot.isDraggingOver ? '#f0f8ff' : 'transparent',
                                  borderRadius: '4px',
                                  padding: '4px'
                                }}
                              >
                                {kanbanData.cards
                                  .filter(card => card.columnId === column.columnId)
                                  .sort((a, b) => a.orderNum - b.orderNum)
                                  .map((card, cardIndex) => (
                                    <Draggable key={card.cardId} draggableId={`card-${card.cardId}`} index={cardIndex}>
                                      {(provided, snapshot) => (
                                        <Card
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          size="small"
                                          style={{
                                            ...provided.draggableProps.style,
                                            marginBottom: '12px',
                                            cursor: 'grab',
                                            boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
                                            transform: snapshot.isDragging ? 'rotate(3deg)' : 'none'
                                          }}
                                          actions={[
                                            <Tooltip title="删除卡片" key="delete">
                                              <Button 
                                                type="text" 
                                                size="small" 
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  Modal.confirm({
                                                    title: '确认删除',
                                                    content: `确定要删除卡片"${card.title}"吗？`,
                                                    okText: '确定',
                                                    cancelText: '取消',
                                                    onOk: () => handleDeleteCard(card.cardId),
                                                  });
                                                }}
                                              />
                                            </Tooltip>
                                          ]}
                                        >
                                          <div>
                                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                              {card.title}
                                            </Text>
                                            {card.content && (
                                              <Paragraph 
                                                ellipsis={{ rows: 3 }}
                                                style={{ 
                                                  margin: 0, 
                                                  color: '#666',
                                                  fontSize: '12px'
                                                }}
                                              >
                                                {card.content}
                                              </Paragraph>
                                            )}
                                            {card.tags && card.tags.length > 0 && (
                                              <div style={{ marginTop: '8px' }}>
                                                {card.tags.map((tag, index) => (
                                                  <Tag key={index} color="blue" style={{ fontSize: '12px' }}>
                                                    {tag}
                                                  </Tag>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </Card>
                                      )}
                                    </Draggable>
                                  ))}
                                {provided.placeholder}
                                
                                {/* 添加卡片按钮 */}
                                <Button 
                                  type="dashed" 
                                  block 
                                  size="small"
                                  icon={<PlusOutlined />}
                                  onClick={() => {
                                    setSelectedColumnId(column.columnId);
                                    setAddCardShow(true);
                                  }}
                                  style={{ marginTop: '8px' }}
                                >
                                  添加卡片
                                </Button>
                              </div>
                            )}
                          </Droppable>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* 添加列的模态框 */}
      <Modal
        title="添加新列"
        open={addColumnShow}
        onCancel={() => {
          setAddColumnShow(false);
          columnForm.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form
          form={columnForm}
          onFinish={handleAddColumn}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="列标题"
            rules={[
              { required: true, message: '请输入列标题！' },
              { max: 50, message: '标题最多50个字符！' }
            ]}
          >
            <Input placeholder="请输入列标题" maxLength={50} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setAddColumnShow(false);
                columnForm.resetFields();
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

      {/* 添加卡片的模态框 */}
      <Modal
        title="添加新卡片"
        open={addCardShow}
        onCancel={() => {
          setAddCardShow(false);
          cardForm.resetFields();
          setSelectedColumnId(null);
        }}
        footer={null}
        width={500}
      >
        <Form
          form={cardForm}
          onFinish={handleAddCard}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="卡片标题"
            rules={[
              { required: true, message: '请输入卡片标题！' },
              { max: 200, message: '标题最多200个字符！' }
            ]}
          >
            <Input placeholder="请输入卡片标题" maxLength={200} />
          </Form.Item>

          <Form.Item
            name="content"
            label="卡片内容"
            rules={[
              { max: 1000, message: '内容最多1000个字符！' }
            ]}
          >
            <TextArea 
              placeholder="请输入卡片内容（可选）" 
              rows={4}
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setAddCardShow(false);
                cardForm.resetFields();
                setSelectedColumnId(null);
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

export default KanbanDetail; 