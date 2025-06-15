/**
 * 前端常量定义
 * 
 * 设计原理：
 * 1. 分类管理：按功能模块分组
 * 2. 统一命名：使用SCREAMING_SNAKE_CASE
 * 3. 类型安全：使用TypeScript枚举和常量断言
 * 4. 易于维护：集中管理所有常量
 */

// ========== 存储键常量 ==========

/**
 * 本地存储键名
 */
export const STORAGE_KEYS = {
  // 认证相关
  ACCESS_TOKEN: 'hardcore_cards_access_token',
  REFRESH_TOKEN: 'hardcore_cards_refresh_token',
  USER_INFO: 'hardcore_cards_user_info',
  
  // 应用设置
  THEME: 'hardcore_cards_theme',
  LANGUAGE: 'hardcore_cards_language',
  SIDEBAR_COLLAPSED: 'hardcore_cards_sidebar_collapsed',
  
  // 业务数据缓存
  KANBAN_LAYOUT: 'hardcore_cards_kanban_layout',
  RECENT_KANBANS: 'hardcore_cards_recent_kanbans',
  DRAFT_CARD: 'hardcore_cards_draft_card',
} as const;

// ========== API端点常量 ==========

/**
 * API接口路径
 */
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/oauth/token',
    LOGOUT: '/oauth/logout',
    REFRESH: '/oauth/refresh',
    REGISTER: '/oauth/register',
    VERIFY_EMAIL: '/oauth/verify-email',
    RESET_PASSWORD: '/oauth/reset-password',
  },
  
  // 用户相关
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    UPLOAD_AVATAR: '/user/upload-avatar',
    SEARCH: '/user/search',
  },
  
  // 看板相关
  KANBAN: {
    LIST: '/kanban/list',
    CREATE: '/kanban/create',
    UPDATE: '/kanban/update',
    DELETE: '/kanban/delete',
    DETAIL: '/kanban/detail',
    SHARE: '/kanban/share',
    COPY: '/kanban/copy',
    ARCHIVE: '/kanban/archive',
  },
  
  // 列相关
  COLUMN: {
    LIST: '/column/list',
    CREATE: '/column/create',
    UPDATE: '/column/update',
    DELETE: '/column/delete',
    SORT: '/column/sort',
  },
  
  // 卡片相关
  CARD: {
    LIST: '/card/list',
    CREATE: '/card/create',
    UPDATE: '/card/update',
    DELETE: '/card/delete',
    MOVE: '/card/move',
    COPY: '/card/copy',
    ARCHIVE: '/card/archive',
    BATCH_MOVE: '/card/batch-move',
  },
  
  // 标签相关
  TAG: {
    LIST: '/tag/list',
    CREATE: '/tag/create',
    UPDATE: '/tag/update',
    DELETE: '/tag/delete',
  },
  
  // 文件上传
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
    AVATAR: '/upload/avatar',
  },
  
  // 搜索相关
  SEARCH: {
    GLOBAL: '/search/global',
    KANBAN: '/search/kanban',
    CARD: '/search/card',
  },
} as const;

// ========== 应用配置常量 ==========

/**
 * 应用配置
 */
export const APP_CONFIG = {
  // 应用信息
  NAME: 'Hardcore Cards',
  VERSION: '1.0.0',
  DESCRIPTION: '强大的看板管理系统',
  
  // 分页配置
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
    SHOW_SIZE_CHANGER: true,
    SHOW_QUICK_JUMPER: true,
  },
  
  // 文件上传配置
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_FILE_TYPES: ['application/pdf', 'application/msword', 'text/plain'],
  },
  
  // 界面配置
  UI: {
    SIDEBAR_WIDTH: 200,
    SIDEBAR_COLLAPSED_WIDTH: 80,
    HEADER_HEIGHT: 64,
    CARD_MIN_HEIGHT: 100,
    COLUMN_MIN_WIDTH: 300,
  },
  
  // 业务规则
  BUSINESS: {
    KANBAN_TITLE_MAX_LENGTH: 100,
    CARD_TITLE_MAX_LENGTH: 200,
    CARD_CONTENT_MAX_LENGTH: 1000,
    COLUMN_TITLE_MAX_LENGTH: 50,
    TAG_NAME_MAX_LENGTH: 20,
    MAX_TAGS_PER_CARD: 10,
  },
} as const;

// ========== 响应状态码 ==========

/**
 * API响应状态码
 */
export const RESPONSE_CODE = {
  SUCCESS: '000',
  BUSINESS_FAILED: '001',
  SYSTEM_ERROR: '002',
  PARAM_ERROR: '003',
  UNAUTHORIZED: '401',
  FORBIDDEN: '403',
  NOT_FOUND: '404',
  SERVER_ERROR: '500',
} as const;

// ========== 业务状态枚举 ==========

/**
 * 看板状态
 */
export const KanbanStatus = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  DELETED: 'DELETED',
} as const;

/**
 * 卡片优先级
 */
export const CardPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

/**
 * 用户角色
 */
export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
} as const;

/**
 * 权限类型
 */
export const PermissionType = {
  READ: 'READ',
  WRITE: 'WRITE',
  ADMIN: 'ADMIN',
} as const;

// ========== 主题配置 ==========

/**
 * 主题配置
 */
export const THEME_CONFIG = {
  LIGHT: {
    primary: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#13c2c2',
    background: '#f0f2f5',
    card: '#ffffff',
    text: '#000000d9',
    textSecondary: '#00000073',
  },
  
  DARK: {
    primary: '#177ddc',
    success: '#49aa19',
    warning: '#d89614',
    error: '#d32029',
    info: '#13a8a8',
    background: '#141414',
    card: '#1f1f1f',
    text: '#ffffffd9',
    textSecondary: '#ffffff73',
  },
} as const;

// ========== 路由路径 ==========

/**
 * 路由路径常量
 */
export const ROUTES = {
  // 认证相关
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // 主要页面
  HOME: '/',
  KANBAN: '/kanban',
  KANBAN_DETAIL: '/kanban/:id',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // 错误页面
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
  UNAUTHORIZED: '/401',
} as const;

// ========== 事件类型 ==========

/**
 * 自定义事件类型
 */
export const EVENTS = {
  // 认证事件
  LOGIN_SUCCESS: 'login_success',
  LOGOUT: 'logout',
  TOKEN_EXPIRED: 'token_expired',
  
  // 看板事件
  KANBAN_CREATED: 'kanban_created',
  KANBAN_UPDATED: 'kanban_updated',
  KANBAN_DELETED: 'kanban_deleted',
  
  // 卡片事件
  CARD_CREATED: 'card_created',
  CARD_UPDATED: 'card_updated',
  CARD_MOVED: 'card_moved',
  CARD_DELETED: 'card_deleted',
  
  // 通知事件
  NOTIFICATION_RECEIVED: 'notification_received',
  
  // 系统事件
  THEME_CHANGED: 'theme_changed',
  LANGUAGE_CHANGED: 'language_changed',
} as const;

// ========== 默认值 ==========

/**
 * 默认值配置
 */
export const DEFAULT_VALUES = {
  // 看板默认列
  DEFAULT_COLUMNS: [
    { title: '待办', color: '#f50' },
    { title: '进行中', color: '#2db7f5' },
    { title: '已完成', color: '#87d068' },
  ],
  
  // 默认用户头像
  DEFAULT_AVATAR: '/assets/images/default-avatar.png',
  
  // 默认看板背景
  DEFAULT_KANBAN_BACKGROUND: '#f0f2f5',
  
  // 默认标签颜色
  DEFAULT_TAG_COLORS: [
    '#f50', '#2db7f5', '#87d068', '#108ee9',
    '#f56a00', '#eb2f96', '#52c41a', '#13c2c2',
  ],
} as const;

// ========== 正则表达式 ==========

/**
 * 常用正则表达式
 */
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/,
  USERNAME: /^[a-zA-Z0-9_]{4,20}$/,
  COLOR: /^#[0-9A-Fa-f]{6}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// ========== 类型定义 ==========

/**
 * 常量类型推断
 */
export type ApiEndpoint = typeof API_ENDPOINTS;
export type StorageKey = typeof STORAGE_KEYS;
export type AppConfig = typeof APP_CONFIG;
export type ThemeConfig = typeof THEME_CONFIG;
export type Route = typeof ROUTES;
export type Event = typeof EVENTS; 