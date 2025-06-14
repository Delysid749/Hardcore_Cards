import { httpService } from './http';
import type { LoginForm, RegisterForm, User } from '../types';

/**
 * 认证服务API
 * 对应原项目的用户认证相关接口
 */
export const authService = {
  /**
   * 用户登录
   * 对应原项目：POST /user/login
   * @param loginData 登录表单数据
   * @returns Promise<{token: string, user: User}>
   */
  login: (loginData: LoginForm) => {
    return httpService.post<{
      token: string;
      refreshToken: string;
      user: User;
    }>('/user/login', loginData);
  },

  /**
   * 用户注册
   * 对应原项目：POST /user/register
   * @param registerData 注册表单数据
   * @returns Promise<{token: string, user: User}>
   */
  register: (registerData: RegisterForm) => {
    return httpService.post<{
      token: string;
      refreshToken: string;
      user: User;
    }>('/user/register', registerData);
  },

  /**
   * 刷新访问令牌
   * 对应原项目：POST /user/refresh-token
   * @param refreshToken 刷新令牌
   * @returns Promise<{token: string}>
   */
  refreshToken: (refreshToken: string) => {
    return httpService.post<{
      token: string;
      refreshToken: string;
    }>('/user/refresh-token', { refreshToken });
  },

  /**
   * 用户登出
   * 对应原项目：POST /user/logout
   * @returns Promise<void>
   */
  logout: () => {
    return httpService.post<void>('/user/logout');
  },

  /**
   * 获取当前用户信息
   * 对应原项目：GET /user/profile
   * @returns Promise<User>
   */
  getCurrentUser: () => {
    return httpService.get<User>('/user/profile');
  },

  /**
   * 验证token有效性
   * 对应原项目：GET /user/verify-token
   * @returns Promise<{valid: boolean, user?: User}>
   */
  verifyToken: () => {
    return httpService.get<{
      valid: boolean;
      user?: User;
    }>('/user/verify-token');
  },

  /**
   * 发送密码重置邮件
   * 对应原项目：POST /user/forgot-password
   * @param email 用户邮箱
   * @returns Promise<void>
   */
  forgotPassword: (email: string) => {
    return httpService.post<void>('/user/forgot-password', { email });
  },

  /**
   * 重置密码
   * 对应原项目：POST /user/reset-password
   * @param token 重置令牌
   * @param newPassword 新密码
   * @returns Promise<void>
   */
  resetPassword: (token: string, newPassword: string) => {
    return httpService.post<void>('/user/reset-password', {
      token,
      newPassword,
    });
  },
};

export default authService; 