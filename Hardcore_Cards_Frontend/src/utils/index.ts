import { STORAGE_KEYS } from '../constants';

/**
 * 浏览器本地存储工具类
 * 
 * 原理说明：
 * 1. 统一封装localStorage操作，提供类型安全
 * 2. 支持JSON对象的序列化/反序列化
 * 3. 错误处理，避免存储配额超限等问题
 */
export const storage = {
  /**
   * 设置存储项
   */
  set: <T>(key: string, value: T): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  /**
   * 获取存储项
   */
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  /**
   * 移除存储项
   */
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  /**
   * 清空所有存储项
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

/**
 * Token管理工具类 - 与原项目保持一致
 */
export const tokenUtils = {
  getAccessToken: () => storage.get(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token: string) => storage.set(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeAccessToken: () => storage.remove(STORAGE_KEYS.ACCESS_TOKEN),
  
  getRefreshToken: () => storage.get(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token: string) => storage.set(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: () => storage.remove(STORAGE_KEYS.REFRESH_TOKEN),
  
  // 清除所有Token
  clearAll: () => {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },
  
  // 格式化Authorization头
  formatAuthorizationHeader: (): string | null => {
    const token = storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    return token ? `Bearer ${token}` : null;
  }
};

/**
 * 日期格式化工具
 */
export const dateUtils = {
  /**
   * 格式化日期为 YYYY-MM-DD HH:mm:ss
   */
  formatDateTime: (date: Date | string | number): string => {
    const d = new Date(date);
    return d.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },

  /**
   * 格式化日期为相对时间（如：3分钟前）
   */
  formatRelativeTime: (date: Date | string | number): string => {
    const now = new Date();
    const target = new Date(date);
    const diff = now.getTime() - target.getTime();

    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const month = day * 30;
    const year = month * 12;

    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`;
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`;
    } else if (diff < month) {
      return `${Math.floor(diff / day)}天前`;
    } else if (diff < year) {
      return `${Math.floor(diff / month)}个月前`;
    } else {
      return `${Math.floor(diff / year)}年前`;
    }
  },
};

// 颜色工具
export const colorUtils = {
  // 生成随机颜色
  random: () => '#' + Math.random().toString(16).substr(-6),
  
  // 判断颜色是否为深色
  isDark: (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  },
  
  // 获取对比色（黑色或白色）
  getContrastColor: (color: string) => {
    return colorUtils.isDark(color) ? '#ffffff' : '#000000';
  },
  
  // 添加透明度
  addAlpha: (color: string, alpha: number) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};

// 文件工具
export const fileUtils = {
  // 格式化文件大小
  formatSize: (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
  
  // 检查文件类型
  isImage: (file: File) => {
    return file.type.startsWith('image/');
  },
  
  // 获取文件扩展名
  getExtension: (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  },
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 节流函数
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// 深拷贝
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}; 