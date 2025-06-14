import { httpService } from './http';
import type { User } from '../types';

/**
 * 用户管理服务API
 * 对应原项目的用户信息管理相关接口
 */
export const userService = {
  /**
   * 更新用户资料
   * 对应原项目：PUT /user/profile
   * @param userData 用户数据
   * @returns Promise<User>
   */
  updateProfile: (userData: Partial<User>) => {
    return httpService.put<User>('/user/profile', userData);
  },

  /**
   * 上传用户头像
   * 对应原项目：POST /user/avatar
   * @param file 头像文件
   * @param onProgress 上传进度回调
   * @returns Promise<{avatarUrl: string}>
   */
  uploadAvatar: (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return httpService.upload<{
      avatarUrl: string;
    }>('/user/avatar', formData, onProgress);
  },

  /**
   * 修改密码
   * 对应原项目：PUT /user/password
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   * @returns Promise<void>
   */
  changePassword: (oldPassword: string, newPassword: string) => {
    return httpService.put<void>('/user/password', {
      oldPassword,
      newPassword,
    });
  },

  /**
   * 获取用户统计信息
   * 对应原项目：GET /user/stats
   * @returns Promise<UserStats>
   */
  getUserStats: () => {
    return httpService.get<{
      totalKanbans: number;
      totalCards: number;
      completedCards: number;
      collaboratingKanbans: number;
      recentActivity: Array<{
        id: string;
        type: 'create' | 'update' | 'delete' | 'collaborate';
        description: string;
        timestamp: string;
      }>;
    }>('/user/stats');
  },

  /**
   * 搜索用户（用于协作邀请）
   * 对应原项目：GET /user/search
   * @param keyword 搜索关键词
   * @returns Promise<User[]>
   */
  searchUsers: (keyword: string) => {
    return httpService.get<User[]>('/user/search', {
      params: { keyword },
    });
  },

  /**
   * 获取用户的协作邀请列表
   * 对应原项目：GET /user/invitations
   * @returns Promise<Invitation[]>
   */
  getInvitations: () => {
    return httpService.get<Array<{
      id: string;
      kanbanId: string;
      kanbanTitle: string;
      inviterName: string;
      inviterAvatar?: string;
      role: 'viewer' | 'editor' | 'admin';
      status: 'pending' | 'accepted' | 'rejected';
      createdAt: string;
    }>>('/user/invitations');
  },

  /**
   * 响应协作邀请
   * 对应原项目：PUT /user/invitations/:id
   * @param invitationId 邀请ID
   * @param action 操作类型
   * @returns Promise<void>
   */
  respondToInvitation: (invitationId: string, action: 'accept' | 'reject') => {
    return httpService.put<void>(`/user/invitations/${invitationId}`, {
      action,
    });
  },

  /**
   * 删除用户账户
   * 对应原项目：DELETE /user/account
   * @param password 确认密码
   * @returns Promise<void>
   */
  deleteAccount: (password: string) => {
    return httpService.delete<void>('/user/account', {
      data: { password },
    });
  },
};

export default userService; 