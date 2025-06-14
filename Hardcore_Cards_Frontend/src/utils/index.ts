import dayjs from 'dayjs';
import { STORAGE_KEYS } from '../constants';

// 本地存储工具
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  remove: (key: string) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  },
};

// Token 相关工具
export const tokenUtils = {
  getToken: () => storage.get(STORAGE_KEYS.TOKEN),
  setToken: (token: string) => storage.set(STORAGE_KEYS.TOKEN, token),
  removeToken: () => storage.remove(STORAGE_KEYS.TOKEN),
  
  getRefreshToken: () => storage.get(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token: string) => storage.set(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: () => storage.remove(STORAGE_KEYS.REFRESH_TOKEN),
  
  clearAll: () => {
    tokenUtils.removeToken();
    tokenUtils.removeRefreshToken();
    storage.remove(STORAGE_KEYS.USER_INFO);
  },
};

// 日期格式化工具
export const dateUtils = {
  format: (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(date).format(format);
  },
  
  formatRelative: (date: string | Date) => {
    const now = dayjs();
    const target = dayjs(date);
    const diff = now.diff(target, 'minute');
    
    if (diff < 1) return '刚刚';
    if (diff < 60) return `${diff}分钟前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
    if (diff < 10080) return `${Math.floor(diff / 1440)}天前`;
    
    return target.format('YYYY-MM-DD');
  },
  
  isOverdue: (date: string | Date) => {
    return dayjs().isAfter(dayjs(date));
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

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
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