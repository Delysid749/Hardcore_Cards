import axios from 'axios';
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import qs from 'qs';

/**
 * API响应数据结构 - 与原项目保持一致
 */
export interface ApiResponse<T = any> {
  code: string;
  msg: string;
  data: T;
}

/**
 * 创建axios实例 - 与原Vue项目配置保持一致
 */
const instance = axios.create({
  baseURL: 'http://localhost:9201',
  timeout: 15000
});

/**
 * 请求拦截器 - 完全按照原项目逻辑
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果认证就统一设置 - 与原项目逻辑一致
    const token = window.localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器 - 完全按照原项目逻辑
 */
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(response.data ? response.data : response);
    if (!response.data || response.data.code !== "000") {
      console.log(response);
      if (response.data && response.data.code === "A401") {
        tokenFail();
        return Promise.reject(response.data);
      }
      message.error(response.data ? response.data.msg : '请求失败');
      return Promise.reject(response.data ? response.data : response);
    }
    return response.data ? response.data : response;
  },
  (error: AxiosError<ApiResponse>) => {
    console.error('请求错误:', error);
    
    // 检查是否有响应对象 - 与原项目错误处理逻辑一致
    if (error.response) {
      // 服务器返回了错误状态码
      if (error.response.status === 401) {
        tokenFail();
        return Promise.reject(error);
      }
      
      // 获取错误信息
      let errorMessage = '请求失败';
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.msg) {
          errorMessage = error.response.data.msg;
        } else if ((error.response.data as any).message) {
          errorMessage = (error.response.data as any).message;
        } else {
          errorMessage = `请求失败 (${error.response.status})`;
        }
      } else {
        errorMessage = `请求失败 (${error.response.status})`;
      }
      
      message.error(errorMessage);
    } else if (error.request) {
      // 请求已发送但没有收到响应
      if (error.code === 'ECONNABORTED') {
        // 超时错误
        message.error('请求超时，服务器响应较慢，请稍后重试');
      } else {
        message.error('网络连接失败，请检查后端服务是否启动');
      }
    } else {
      // 其他错误
      message.error(error.message || '请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

/**
 * Token失效处理 - 完全按照原项目逻辑
 */
export function tokenFail() {
  const rftoken = localStorage.getItem("refresh_token");
  if (rftoken) {
    const data = {
      grant_type: "refresh_token",
      client_id: "fic",
      client_secret: "fic",
      refresh_token: rftoken
    };
    
    axios.post("/api/oauth/token", qs.stringify(data), {
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      timeout: 15000
    })
    .then(response => {
      console.log(response);
      if (response.data.code === "000") {
        localStorage.setItem("access_token", response.data.data.access_token);
        localStorage.setItem("refresh_token", response.data.data.refresh_token);
        // 在React中需要重新加载页面或更新路由
        window.location.href = "/home";
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
      }
    })
    .catch(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
    });
  } else {
    // 如果没有 refresh_token，直接跳转到登录页
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  }
}

/**
 * 通用请求函数 - 与原项目保持一致
 */
export function request(config: any) {
  return instance(config);
} 