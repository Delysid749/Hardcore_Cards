import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { tokenUtils, storage } from '../../utils';
import { STORAGE_KEYS } from '../../constants';
import type { User, LoginForm, RegisterForm } from '../../types';

/**
 * 认证状态接口定义
 * 
 * 原理说明：
 * 1. isAuthenticated：用户是否已登录
 * 2. user：当前登录用户信息
 * 3. token：JWT访问令牌
 * 4. loading：异步操作加载状态
 * 5. error：错误信息
 */
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * 初始状态
 * 
 * 原理说明：
 * 从localStorage恢复登录状态，实现页面刷新后状态持久化
 */
const initialState: AuthState = {
  isAuthenticated: !!tokenUtils.getToken(),
  user: storage.get(STORAGE_KEYS.USER_INFO),
  token: tokenUtils.getToken(),
  loading: false,
  error: null,
};

/**
 * 异步Action：用户登录
 * 
 * 原理说明：
 * 1. createAsyncThunk：RTK提供的异步action创建器
 * 2. 自动生成pending、fulfilled、rejected三个action
 * 3. 支持错误处理和加载状态管理
 */
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (loginData: LoginForm, { rejectWithValue }) => {
    try {
      // 这里后续会替换为实际的API调用
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('登录失败');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '登录失败');
    }
  }
);

/**
 * 异步Action：用户注册
 */
export const registerAsync = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterForm, { rejectWithValue }) => {
    try {
      // 这里后续会替换为实际的API调用
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error('注册失败');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '注册失败');
    }
  }
);

/**
 * Auth Slice
 * 
 * 原理说明：
 * 1. createSlice：RTK的核心API，自动生成action creators和reducer
 * 2. reducers：同步action处理器
 * 3. extraReducers：异步action处理器
 * 4. Immer：内置不可变更新，可以直接修改state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },
    
    // 登出
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      
      // 清除本地存储
      tokenUtils.clearAll();
    },
    
    // 更新用户信息
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        storage.set(STORAGE_KEYS.USER_INFO, state.user);
      }
    },
  },
  extraReducers: (builder) => {
    // 登录异步操作处理
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        
        // 保存到本地存储
        tokenUtils.setToken(action.payload.token);
        storage.set(STORAGE_KEYS.USER_INFO, action.payload.user);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 注册异步操作处理
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        
        // 保存到本地存储
        tokenUtils.setToken(action.payload.token);
        storage.set(STORAGE_KEYS.USER_INFO, action.payload.user);
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// 导出action creators
export const { clearError, logout, updateUser } = authSlice.actions;

// 导出reducer
export default authSlice.reducer; 