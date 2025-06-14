import { httpService } from './http';
import type { Kanban, KanbanColumn, Card, KanbanForm } from '../types';

/**
 * 看板管理服务API
 * 对应原项目的看板相关接口
 */
export const kanbanService = {
  /**
   * 获取用户的所有看板列表
   * 对应原项目：GET /kanban/all
   * @returns Promise<Kanban[]>
   */
  getAllKanbans: () => {
    return httpService.get<Kanban[]>('/kanban/all');
  },

  /**
   * 获取看板详细内容
   * 对应原项目：GET /kanban/:id
   * @param kanbanId 看板ID
   * @returns Promise<{kanban: Kanban, columns: KanbanColumn[], cards: Card[]}>
   */
  getKanbanDetail: (kanbanId: string) => {
    return httpService.get<{
      kanban: Kanban;
      columns: KanbanColumn[];
      cards: Card[];
    }>(`/kanban/${kanbanId}`);
  },

  /**
   * 创建新看板
   * 对应原项目：POST /kanban/create
   * @param kanbanData 看板数据
   * @returns Promise<Kanban>
   */
  createKanban: (kanbanData: KanbanForm) => {
    return httpService.post<Kanban>('/kanban/create', kanbanData);
  },

  /**
   * 更新看板信息
   * 对应原项目：PUT /kanban/:id
   * @param kanbanId 看板ID
   * @param kanbanData 更新数据
   * @returns Promise<Kanban>
   */
  updateKanban: (kanbanId: string, kanbanData: Partial<KanbanForm>) => {
    return httpService.put<Kanban>(`/kanban/${kanbanId}`, kanbanData);
  },

  /**
   * 删除看板
   * 对应原项目：DELETE /kanban/:id
   * @param kanbanId 看板ID
   * @returns Promise<void>
   */
  deleteKanban: (kanbanId: string) => {
    return httpService.delete<void>(`/kanban/${kanbanId}`);
  },

  /**
   * 收藏/取消收藏看板
   * 对应原项目：POST /kanban/:id/collect
   * @param kanbanId 看板ID
   * @returns Promise<{isCollected: boolean}>
   */
  toggleKanbanCollect: (kanbanId: string) => {
    return httpService.post<{
      isCollected: boolean;
    }>(`/kanban/${kanbanId}/collect`);
  },

  /**
   * 获取收藏的看板列表
   * 对应原项目：GET /kanban/collected
   * @returns Promise<Kanban[]>
   */
  getCollectedKanbans: () => {
    return httpService.get<Kanban[]>('/kanban/collected');
  },

  /**
   * 复制看板
   * 对应原项目：POST /kanban/:id/copy
   * @param kanbanId 看板ID
   * @param newTitle 新看板标题
   * @returns Promise<Kanban>
   */
  copyKanban: (kanbanId: string, newTitle: string) => {
    return httpService.post<Kanban>(`/kanban/${kanbanId}/copy`, {
      title: newTitle,
    });
  },

  /**
   * 获取看板协作成员
   * 对应原项目：GET /kanban/:id/members
   * @param kanbanId 看板ID
   * @returns Promise<KanbanMember[]>
   */
  getKanbanMembers: (kanbanId: string) => {
    return httpService.get<Array<{
      id: string;
      userId: string;
      username: string;
      email: string;
      avatar?: string;
      role: 'owner' | 'admin' | 'editor' | 'viewer';
      joinedAt: string;
    }>>(`/kanban/${kanbanId}/members`);
  },

  /**
   * 邀请用户协作
   * 对应原项目：POST /kanban/:id/invite
   * @param kanbanId 看板ID
   * @param email 被邀请用户邮箱
   * @param role 角色
   * @returns Promise<void>
   */
  inviteUser: (kanbanId: string, email: string, role: 'editor' | 'viewer') => {
    return httpService.post<void>(`/kanban/${kanbanId}/invite`, {
      email,
      role,
    });
  },

  /**
   * 移除协作成员
   * 对应原项目：DELETE /kanban/:id/members/:userId
   * @param kanbanId 看板ID
   * @param userId 用户ID
   * @returns Promise<void>
   */
  removeMember: (kanbanId: string, userId: string) => {
    return httpService.delete<void>(`/kanban/${kanbanId}/members/${userId}`);
  },

  /**
   * 更新成员角色
   * 对应原项目：PUT /kanban/:id/members/:userId/role
   * @param kanbanId 看板ID
   * @param userId 用户ID
   * @param role 新角色
   * @returns Promise<void>
   */
  updateMemberRole: (kanbanId: string, userId: string, role: 'admin' | 'editor' | 'viewer') => {
    return httpService.put<void>(`/kanban/${kanbanId}/members/${userId}/role`, {
      role,
    });
  },

  /**
   * 搜索看板
   * 对应原项目：GET /kanban/search
   * @param keyword 搜索关键词
   * @returns Promise<Kanban[]>
   */
  searchKanbans: (keyword: string) => {
    return httpService.get<Kanban[]>('/kanban/search', {
      params: { keyword },
    });
  },

  /**
   * 获取最近访问的看板
   * 对应原项目：GET /kanban/recent
   * @returns Promise<Kanban[]>
   */
  getRecentKanbans: () => {
    return httpService.get<Kanban[]>('/kanban/recent');
  },
};

export default kanbanService; 