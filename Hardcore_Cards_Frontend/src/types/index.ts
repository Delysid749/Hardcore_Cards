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

// RSA加密相关类型
export interface RsaKeyResponse {
  publicKey: string;
  uuid: string;
}

// 验证码相关类型
export interface CaptchaResponse {
  image: string;    // base64编码的验证码图片
  uuid: string;     // 验证码标识
}

// 邮件验证码类型
export interface EmailCodeForm {
  email: string;
  type?: string;    // 验证码类型：register, reset, etc.
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
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
  rsa_uuid?: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  nickname: string;
  rsaUuid?: string;
  emailCode?: string;
}

// 密码重置表单类型
export interface ResetPasswordForm {
  email: string;
  password: string;
  emailCode: string;
  rsaUuid?: string;
}

// 密码更新表单类型
export interface UpdatePasswordForm {
  oldpw: string;
  newpw: string;
  rsaUuid?: string;
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