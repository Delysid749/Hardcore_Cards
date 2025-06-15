import axios from 'axios';
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { STORAGE_KEYS } from '../constants';
import { tokenUtils } from '../utils/tokenUtils';

/**
 * API响应数据结构
 * 对应后端统一响应格式 R<T>
 */
export interface ApiResponse<T = any> {
  code: string;
  msg: string;
  data: T;
  total?: number;
}

/**
 * 请求配置扩展
 */
interface RequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;      // 跳过Token验证
  skipErrorHandler?: boolean; // 跳过统一错误处理
}

/**
 * 创建axios实例
 * 
 * 设计原理：
 * 1. 统一baseURL：所有请求都通过代理转发
 * 2. 超时设置：避免请求长时间挂起
 * 3. 拦截器：统一处理Token和错误
 */
const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/**
 * 请求拦截器
 * 
 * 功能：
 * 1. 自动添加Authorization头
 * 2. 请求日志记录
 * 3. 请求参数处理
 */
request.interceptors.request.use(
  (config: RequestConfig) => {
    // 打印请求日志（仅开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    // 自动添加Token（除非明确跳过）
    if (!config.skipAuth) {
      const authHeader = tokenUtils.formatAuthorizationHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 
 * 功能：
 * 1. 统一处理响应格式
 * 2. Token过期自动刷新
 * 3. 错误统一处理
 */
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 打印响应日志（仅开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.config.url}`, data);
    }

    // 检查业务状态码
    if (data.code === '000') {
      // 成功响应 - 返回原response，保持axios响应格式
      return response;
    } else {
      // 业务错误
      const error = new Error(data.msg || '请求失败') as any;
      error.code = data.code;
      error.response = response;
      return Promise.reject(error);
    }
  },
  async (error: AxiosError<ApiResponse>) => {
    const { response, config } = error;

    // 打印错误日志
    console.error('❌ Response Error:', {
      status: response?.status,
      data: response?.data,
      url: config?.url,
    });

    // 处理HTTP状态码错误
    if (response) {
      switch (response.status) {
        case 401: {
          // Token过期，尝试刷新
          const refreshToken = tokenUtils.getRefreshToken();
          if (refreshToken && !config?.url?.includes('/oauth/token')) {
            try {
              await refreshTokenRequest();
              // 重新发送原请求
              return request(config!);
            } catch (refreshError) {
              // 刷新失败，跳转登录
              handleAuthError();
              return Promise.reject(refreshError);
            }
          } else {
            handleAuthError();
          }
          break;
        }
        case 403:
          message.error('权限不足，请联系管理员');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误，请稍后重试');
          break;
        default:
          message.error(response.data?.msg || `请求失败 (${response.status})`);
      }
    } else if (error.code === 'ECONNABORTED') {
      // 超时错误
      message.error('请求超时，请检查网络连接');
    } else {
      // 网络错误
      message.error('网络连接失败，请检查网络');
    }

    return Promise.reject(error);
  }
);

/**
 * 刷新Token
 */
async function refreshTokenRequest(): Promise<void> {
  const refreshToken = tokenUtils.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  try {
    const response = await axios.post('/api/oauth/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }, {
      skipAuth: true, // 刷新请求不需要Authorization头
    } as RequestConfig);

    const tokenInfo = response.data.data;
    
    // 更新Token信息
    if (tokenInfo.access_token && tokenInfo.refresh_token) {
      tokenUtils.setTokenInfo(tokenInfo);
    } else {
      // 兼容旧格式
      tokenUtils.setAccessToken(tokenInfo.access_token);
      tokenUtils.setRefreshToken(tokenInfo.refresh_token);
    }

  } catch (error) {
    // 刷新失败，清除所有Token
    tokenUtils.clearAll();
    throw error;
  }
}

/**
 * 处理认证错误
 */
function handleAuthError(): void {
  // 清除本地存储
  tokenUtils.clearAll();
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  
  // 提示用户
  message.error('登录已过期，请重新登录');
  
  // 跳转登录页面
  window.location.href = '/login';
}

/**
 * 通用请求方法封装
 */
export const requestApi = {
  /**
   * GET请求
   */
  get: <T = any>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return request.get(url, { params, ...config }).then(res => res.data);
  },

  /**
   * POST请求
   */
  post: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return request.post(url, data, config).then(res => res.data);
  },

  /**
   * PUT请求
   */
  put: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return request.put(url, data, config).then(res => res.data);
  },

  /**
   * DELETE请求
   */
  delete: <T = any>(url: string, params?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return request.delete(url, { params, ...config }).then(res => res.data);
  },

  /**
   * PATCH请求
   */
  patch: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return request.patch(url, data, config).then(res => res.data);
  },

  /**
   * 文件上传
   */
  upload: <T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<ApiResponse<T>> => {
    return request.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },
};

export default request; 