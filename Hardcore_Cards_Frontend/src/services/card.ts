import { httpService } from './http';
import type { Card } from '../types';

/**
 * 卡片管理服务API
 * 对应原项目的卡片相关接口
 */
export const cardService = {
  /**
   * 创建新卡片
   * 对应原项目：POST /card/create
   * @param cardData 卡片数据
   * @returns Promise<Card>
   */
  createCard: (cardData: {
    kanbanId: string;
    columnId: string;
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    assigneeId?: string;
    tags?: string[];
  }) => {
    return httpService.post<Card>('/card/create', cardData);
  },

  /**
   * 获取卡片详情
   * 对应原项目：GET /card/:id
   * @param cardId 卡片ID
   * @returns Promise<Card>
   */
  getCardDetail: (cardId: string) => {
    return httpService.get<Card>(`/card/${cardId}`);
  },

  /**
   * 更新卡片信息
   * 对应原项目：PUT /card/:id
   * @param cardId 卡片ID
   * @param cardData 更新数据
   * @returns Promise<Card>
   */
  updateCard: (cardId: string, cardData: Partial<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    assigneeId: string;
    tags: string[];
    status: 'todo' | 'in-progress' | 'done';
  }>) => {
    return httpService.put<Card>(`/card/${cardId}`, cardData);
  },

  /**
   * 删除卡片
   * 对应原项目：DELETE /card/:id
   * @param cardId 卡片ID
   * @returns Promise<void>
   */
  deleteCard: (cardId: string) => {
    return httpService.delete<void>(`/card/${cardId}`);
  },

  /**
   * 移动卡片到不同列
   * 对应原项目：PUT /card/:id/move
   * @param cardId 卡片ID
   * @param targetColumnId 目标列ID
   * @param position 新位置
   * @returns Promise<void>
   */
  moveCard: (cardId: string, targetColumnId: string, position: number) => {
    return httpService.put<void>(`/card/${cardId}/move`, {
      targetColumnId,
      position,
    });
  },

  /**
   * 批量移动卡片（拖拽排序）
   * 对应原项目：PUT /card/batch-move
   * @param moves 移动操作数组
   * @returns Promise<void>
   */
  batchMoveCards: (moves: Array<{
    cardId: string;
    targetColumnId: string;
    position: number;
  }>) => {
    return httpService.put<void>('/card/batch-move', { moves });
  },

  /**
   * 复制卡片
   * 对应原项目：POST /card/:id/copy
   * @param cardId 卡片ID
   * @param targetColumnId 目标列ID（可选）
   * @returns Promise<Card>
   */
  copyCard: (cardId: string, targetColumnId?: string) => {
    return httpService.post<Card>(`/card/${cardId}/copy`, {
      targetColumnId,
    });
  },

  /**
   * 添加卡片评论
   * 对应原项目：POST /card/:id/comments
   * @param cardId 卡片ID
   * @param content 评论内容
   * @returns Promise<Comment>
   */
  addComment: (cardId: string, content: string) => {
    return httpService.post<{
      id: string;
      cardId: string;
      userId: string;
      username: string;
      userAvatar?: string;
      content: string;
      createdAt: string;
      updatedAt: string;
    }>(`/card/${cardId}/comments`, { content });
  },

  /**
   * 获取卡片评论列表
   * 对应原项目：GET /card/:id/comments
   * @param cardId 卡片ID
   * @returns Promise<Comment[]>
   */
  getComments: (cardId: string) => {
    return httpService.get<Array<{
      id: string;
      cardId: string;
      userId: string;
      username: string;
      userAvatar?: string;
      content: string;
      createdAt: string;
      updatedAt: string;
    }>>(`/card/${cardId}/comments`);
  },

  /**
   * 删除评论
   * 对应原项目：DELETE /card/comments/:id
   * @param commentId 评论ID
   * @returns Promise<void>
   */
  deleteComment: (commentId: string) => {
    return httpService.delete<void>(`/card/comments/${commentId}`);
  },

  /**
   * 上传卡片附件
   * 对应原项目：POST /card/:id/attachments
   * @param cardId 卡片ID
   * @param file 文件
   * @param onProgress 上传进度回调
   * @returns Promise<Attachment>
   */
  uploadAttachment: (cardId: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return httpService.upload<{
      id: string;
      cardId: string;
      filename: string;
      originalName: string;
      size: number;
      mimeType: string;
      url: string;
      uploadedBy: string;
      uploadedAt: string;
    }>(`/card/${cardId}/attachments`, formData, onProgress);
  },

  /**
   * 获取卡片附件列表
   * 对应原项目：GET /card/:id/attachments
   * @param cardId 卡片ID
   * @returns Promise<Attachment[]>
   */
  getAttachments: (cardId: string) => {
    return httpService.get<Array<{
      id: string;
      cardId: string;
      filename: string;
      originalName: string;
      size: number;
      mimeType: string;
      url: string;
      uploadedBy: string;
      uploadedAt: string;
    }>>(`/card/${cardId}/attachments`);
  },

  /**
   * 删除附件
   * 对应原项目：DELETE /card/attachments/:id
   * @param attachmentId 附件ID
   * @returns Promise<void>
   */
  deleteAttachment: (attachmentId: string) => {
    return httpService.delete<void>(`/card/attachments/${attachmentId}`);
  },

  /**
   * 搜索卡片
   * 对应原项目：GET /card/search
   * @param kanbanId 看板ID
   * @param keyword 搜索关键词
   * @returns Promise<Card[]>
   */
  searchCards: (kanbanId: string, keyword: string) => {
    return httpService.get<Card[]>('/card/search', {
      params: { kanbanId, keyword },
    });
  },

  /**
   * 获取用户分配的卡片
   * 对应原项目：GET /card/assigned
   * @returns Promise<Card[]>
   */
  getAssignedCards: () => {
    return httpService.get<Card[]>('/card/assigned');
  },

  /**
   * 获取即将到期的卡片
   * 对应原项目：GET /card/due-soon
   * @param days 天数（默认7天）
   * @returns Promise<Card[]>
   */
  getDueSoonCards: (days: number = 7) => {
    return httpService.get<Card[]>('/card/due-soon', {
      params: { days },
    });
  },
};

export default cardService; 