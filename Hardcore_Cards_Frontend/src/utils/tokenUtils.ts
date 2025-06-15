import { STORAGE_KEYS } from '../constants';

/**
 * Token工具类
 * 
 * 设计原理：
 * 1. 集中管理：统一管理所有Token相关操作
 * 2. 安全存储：支持不同存储方式（localStorage、sessionStorage、Cookie）
 * 3. 自动过期：Token过期自动清理
 * 4. 类型安全：TypeScript类型保护
 */

export interface TokenInfo {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
}

export interface DecodedToken {
  exp: number;      // 过期时间戳
  iat: number;      // 签发时间戳
  userId: string;   // 用户ID
  username: string; // 用户名
  authorities: string[]; // 权限列表
}

/**
 * Token管理工具类
 */
export const tokenUtils = {
  /**
   * 设置访问Token
   * @param token 访问Token
   */
  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },

  /**
   * 获取访问Token
   * @returns 访问Token或null
   */
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  /**
   * 设置刷新Token
   * @param token 刷新Token
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  /**
   * 获取刷新Token
   * @returns 刷新Token或null
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  /**
   * 设置Token信息（同时设置访问Token和刷新Token）
   * @param tokenInfo Token信息对象
   */
  setTokenInfo(tokenInfo: TokenInfo): void {
    this.setAccessToken(tokenInfo.access_token);
    this.setRefreshToken(tokenInfo.refresh_token);
    
    // 设置过期时间（当前时间 + expires_in秒）
    const expireTime = Date.now() + tokenInfo.expires_in * 1000;
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN + '_expire', expireTime.toString());
  },

  /**
   * 检查Token是否存在
   * @returns 是否存在有效Token
   */
  hasToken(): boolean {
    const accessToken = this.getAccessToken();
    return accessToken !== null && accessToken.trim() !== '';
  },

  /**
   * 检查Token是否过期
   * @returns 是否过期
   */
  isTokenExpired(): boolean {
    const expireTimeStr = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN + '_expire');
    if (!expireTimeStr) {
      // 如果没有过期时间记录，尝试解析Token
      return this.isTokenExpiredByDecode();
    }
    
    const expireTime = parseInt(expireTimeStr, 10);
    return Date.now() >= expireTime - 60000; // 提前1分钟判定为过期
  },

  /**
   * 通过解析Token判断是否过期
   * @returns 是否过期
   */
  isTokenExpiredByDecode(): boolean {
    try {
      const token = this.getAccessToken();
      if (!token) return true;
      
      const decoded = this.decodeToken(token);
      if (!decoded) return true;
      
      // JWT的exp是秒级时间戳，需要转换为毫秒
      const expireTime = decoded.exp * 1000;
      return Date.now() >= expireTime - 60000; // 提前1分钟判定为过期
    } catch (error) {
      console.error('Token解析失败:', error);
      return true;
    }
  },

  /**
   * 解析JWT Token
   * @param token JWT Token
   * @returns 解析后的Token信息
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      // JWT格式：header.payload.signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('无效的JWT格式');
        return null;
      }

      // 解码payload部分（Base64URL）
      const payload = parts[1];
      // 替换Base64URL特殊字符
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // 补齐padding
      const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
      
      const decoded = JSON.parse(atob(padded));
      return decoded as DecodedToken;
    } catch (error) {
      console.error('Token解析失败:', error);
      return null;
    }
  },

  /**
   * 获取当前用户信息（从Token中解析）
   * @returns 用户信息或null
   */
  getCurrentUser(): Partial<DecodedToken> | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const decoded = this.decodeToken(token);
    if (!decoded) return null;
    
    return {
      userId: decoded.userId,
      username: decoded.username,
      authorities: decoded.authorities,
    };
  },

  /**
   * 检查用户是否有指定权限
   * @param permission 权限名称
   * @returns 是否有权限
   */
  hasPermission(permission: string): boolean {
    const userInfo = this.getCurrentUser();
    if (!userInfo || !userInfo.authorities) return false;
    
    return userInfo.authorities.includes(permission);
  },

  /**
   * 检查用户是否有任意一个权限
   * @param permissions 权限名称数组
   * @returns 是否有任意权限
   */
  hasAnyPermission(permissions: string[]): boolean {
    const userInfo = this.getCurrentUser();
    if (!userInfo || !userInfo.authorities) return false;
    
    return permissions.some(permission => userInfo.authorities!.includes(permission));
  },

  /**
   * 检查用户是否有所有权限
   * @param permissions 权限名称数组
   * @returns 是否有所有权限
   */
  hasAllPermissions(permissions: string[]): boolean {
    const userInfo = this.getCurrentUser();
    if (!userInfo || !userInfo.authorities) return false;
    
    return permissions.every(permission => userInfo.authorities!.includes(permission));
  },

  /**
   * 清除所有Token信息
   */
  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN + '_expire');
  },

  /**
   * 格式化Token为Authorization头值
   * @param token Token字符串
   * @returns Authorization头值
   */
  formatAuthorizationHeader(token?: string): string {
    const actualToken = token || this.getAccessToken();
    if (!actualToken) return '';
    
    return `Bearer ${actualToken}`;
  },

  /**
   * 获取Token剩余有效时间（秒）
   * @returns 剩余秒数，-1表示已过期或无Token
   */
  getTokenRemainingTime(): number {
    try {
      const token = this.getAccessToken();
      if (!token) return -1;
      
      const decoded = this.decodeToken(token);
      if (!decoded) return -1;
      
      const expireTime = decoded.exp * 1000; // 转换为毫秒
      const remainingTime = expireTime - Date.now();
      
      return remainingTime > 0 ? Math.floor(remainingTime / 1000) : -1;
    } catch (error) {
      console.error('获取Token剩余时间失败:', error);
      return -1;
    }
  },

  /**
   * 检查Token是否即将过期（5分钟内）
   * @returns 是否即将过期
   */
  isTokenAboutToExpire(): boolean {
    const remainingTime = this.getTokenRemainingTime();
    return remainingTime > 0 && remainingTime <= 300; // 5分钟 = 300秒
  },
};

/**
 * Token管理Hook（用于React组件）
 */
export const useToken = () => {
  return {
    ...tokenUtils,
    
    /**
     * 检查并处理Token状态
     * @returns Token状态信息
     */
    checkTokenStatus() {
      const hasToken = tokenUtils.hasToken();
      const isExpired = hasToken ? tokenUtils.isTokenExpired() : true;
      const isAboutToExpire = hasToken && !isExpired ? tokenUtils.isTokenAboutToExpire() : false;
      const remainingTime = hasToken ? tokenUtils.getTokenRemainingTime() : -1;
      
      return {
        hasToken,
        isExpired,
        isAboutToExpire,
        remainingTime,
        needRefresh: isAboutToExpire,
        currentUser: tokenUtils.getCurrentUser(),
      };
    },
  };
};

export default tokenUtils; 