// API 端点
export const API_ENDPOINTS = {
  // 认证相关
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // 用户相关
  USER_INFO: '/user/info',
  UPDATE_USER: '/user/update',
  UPLOAD_AVATAR: '/user/avatar',
  
  // 看板相关
  KANBANS: '/kanban',
  KANBAN_DETAIL: '/kanban/content',
  KANBAN_COLLECT: '/kanban/collect',
  KANBAN_SHARE: '/kanban/share',
  
  // 列相关
  COLUMNS: '/column',
  
  // 卡片相关
  CARDS: '/card',
} as const;

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'hardcore_cards_token',
  REFRESH_TOKEN: 'hardcore_cards_refresh_token',
  USER_INFO: 'hardcore_cards_user_info',
  THEME: 'hardcore_cards_theme',
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  // 看板默认颜色
  KANBAN_COLORS: [
    '#1890ff', '#52c41a', '#faad14', '#f5222d',
    '#722ed1', '#13c2c2', '#eb2f96', '#fa541c',
  ],
  
  // 分页配置
  PAGE_SIZE: 20,
  
  // 刷新间隔（毫秒）
  REFRESH_INTERVAL: {
    COOPERATING: 5000,      // 协作中5秒刷新
    OUT_OF_COOPERATION: 30000, // 非协作30秒刷新
  },
  
  // 文件上传限制
  UPLOAD_LIMIT: {
    SIZE: 5 * 1024 * 1024, // 5MB
    TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  },
} as const;

// 看板类型
export const KANBAN_TYPES = {
  DEFAULT: 1,
  SCRUM: 2,
  PERSONAL: 3,
} as const;

// HTTP状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 消息类型
export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const; 