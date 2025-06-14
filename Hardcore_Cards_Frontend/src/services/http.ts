import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { tokenUtils } from '../utils';
import { HTTP_STATUS, MESSAGE_TYPES } from '../constants';
import type { ApiResponse } from '../types';

// 创建axios实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加认证token
      const token = tokenUtils.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 打印请求信息（开发环境）
      if (import.meta.env.DEV) {
        console.log('🚀 Request:', {
          url: config.url,
          method: config.method,
          data: config.data,
          params: config.params,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response;
      
      // 打印响应信息（开发环境）
      if (import.meta.env.DEV) {
        console.log('✅ Response:', {
          url: response.config.url,
          status: response.status,
          data: data,
        });
      }
      
      // 检查业务状态码
      if (data.code !== HTTP_STATUS.OK) {
        const errorMessage = data.message || '请求失败';
        message.error(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }
      
      return response;
    },
    async (error) => {
      console.error('❌ Response Error:', error);
      
      const { response } = error;
      
      if (response) {
        const { status, data } = response;
        
        switch (status) {
          case HTTP_STATUS.UNAUTHORIZED:
            // Token过期或无效
            message.error('登录已过期，请重新登录');
            tokenUtils.clearAll();
            // 跳转到登录页
            window.location.href = '/login';
            break;
            
          case HTTP_STATUS.FORBIDDEN:
            message.error('没有权限访问该资源');
            break;
            
          case HTTP_STATUS.NOT_FOUND:
            message.error('请求的资源不存在');
            break;
            
          case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            message.error('服务器内部错误');
            break;
            
          default:
            const errorMessage = data?.message || `请求失败 (${status})`;
            message.error(errorMessage);
        }
      } else if (error.code === 'ECONNABORTED') {
        message.error('请求超时，请检查网络连接');
      } else {
        message.error('网络错误，请检查网络连接');
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// 创建HTTP实例
const http = createAxiosInstance();

// 封装常用的HTTP方法
export const httpService = {
  // GET请求
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return http.get<ApiResponse<T>>(url, config).then(res => res.data.data);
  },

  // POST请求
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.post<ApiResponse<T>>(url, data, config).then(res => res.data.data);
  },

  // PUT请求
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.put<ApiResponse<T>>(url, data, config).then(res => res.data.data);
  },

  // DELETE请求
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return http.delete<ApiResponse<T>>(url, config).then(res => res.data.data);
  },

  // PATCH请求
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return http.patch<ApiResponse<T>>(url, data, config).then(res => res.data.data);
  },

  // 文件上传
  upload: <T = any>(url: string, formData: FormData, onProgress?: (progress: number) => void): Promise<T> => {
    return http.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then(res => res.data.data);
  },

  // 下载文件
  download: (url: string, filename?: string): Promise<void> => {
    return http.get(url, {
      responseType: 'blob',
    }).then(response => {
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    });
  },
};

export default httpService; 