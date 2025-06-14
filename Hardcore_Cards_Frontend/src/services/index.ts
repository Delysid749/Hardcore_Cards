/**
 * API服务统一入口
 * 提供所有业务相关的API服务
 */

// 导出HTTP基础服务
export { httpService } from './http';

// 导出各业务模块服务
export { authService } from './auth';
export { userService } from './user';
export { kanbanService } from './kanban';
export { cardService } from './card';

// 导入服务用于默认导出
import { authService } from './auth';
import { userService } from './user';
import { kanbanService } from './kanban';
import { cardService } from './card';

// 默认导出所有服务的集合
export default {
  auth: authService,
  user: userService,
  kanban: kanbanService,
  card: cardService,
} as const;

/**
 * API服务使用说明：
 * 
 * 1. 认证服务 (authService)
 *    - login: 用户登录
 *    - register: 用户注册
 *    - logout: 用户登出
 *    - refreshToken: 刷新令牌
 *    - getCurrentUser: 获取当前用户信息
 * 
 * 2. 用户服务 (userService)
 *    - updateProfile: 更新用户资料
 *    - uploadAvatar: 上传头像
 *    - changePassword: 修改密码
 *    - getUserStats: 获取用户统计
 * 
 * 3. 看板服务 (kanbanService)
 *    - getAllKanbans: 获取所有看板
 *    - getKanbanDetail: 获取看板详情
 *    - createKanban: 创建看板
 *    - updateKanban: 更新看板
 *    - deleteKanban: 删除看板
 *    - toggleKanbanCollect: 收藏/取消收藏
 * 
 * 4. 卡片服务 (cardService)
 *    - createCard: 创建卡片
 *    - updateCard: 更新卡片
 *    - deleteCard: 删除卡片
 *    - moveCard: 移动卡片
 *    - addComment: 添加评论
 *    - uploadAttachment: 上传附件
 * 
 * 使用示例：
 * ```typescript
 * import { authService, kanbanService } from '@/services';
 * 
 * // 登录
 * const loginResult = await authService.login({ username, password });
 * 
 * // 获取看板列表
 * const kanbans = await kanbanService.getAllKanbans();
 * ```
 */ 