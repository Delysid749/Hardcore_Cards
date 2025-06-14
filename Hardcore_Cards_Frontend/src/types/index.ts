// 用户相关类型
export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 看板相关类型
export interface Kanban {
  id: number;
  title: string;
  color: string;
  type: number;
  collected: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  members: User[];
}

// 看板列类型
export interface KanbanColumn {
  id: number;
  kanbanId: number;
  title: string;
  position: number;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

// 卡片类型
export interface Card {
  id: number;
  columnId: number;
  title: string;
  content?: string;
  position: number;
  assignee?: User;
  dueDate?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

// 看板详情类型
export interface KanbanDetail {
  baseInfo: Kanban;
  columns: KanbanColumn[];
  cooperating: boolean;
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 登录相关类型
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  nickname: string;
}

// 看板表单类型
export interface KanbanForm {
  title: string;
  color: string;
  type: number;
}

// 卡片表单类型
export interface CardForm {
  title: string;
  content?: string;
  assigneeId?: number;
  dueDate?: string;
} 