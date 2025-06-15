import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import { loginReq, userInfoReq, testToken } from '../../services/index';

/**
 * 认证状态接口
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * 初始状态
 */
const initialState: AuthState = {
  user: null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

/**
 * 异步登录操作
 */
export const login = createAsyncThunk(
  'auth/login',
  async (loginData: { username: string; password: string }) => {
    const data = {
      grant_type: "password",
      client_id: "fic", 
      client_secret: "fic",
      username: loginData.username,
      password: loginData.password
    };
    
    const response = await loginReq(data);
    
    // 保存Token
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    
    // 获取用户信息
    const userResponse = await userInfoReq();
    return userResponse.data;
  }
);

/**
 * 异步获取当前用户信息
 */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async () => {
    const response = await userInfoReq();
    return response.data;
  }
);

/**
 * 验证Token有效性
 */
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async () => {
    await testToken();
    const userResponse = await userInfoReq();
    return userResponse.data;
  }
);

/**
 * 认证Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * 登出操作
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // 清除本地存储
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
    
    /**
     * 清除错误
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * 设置用户信息
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // 登录相关
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '登录失败';
        state.isAuthenticated = false;
      })
      
    // 获取用户信息相关
    builder
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      
    // Token验证相关
    builder
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        // 清除无效Token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer; 