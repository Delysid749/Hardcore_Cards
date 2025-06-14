import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authSlice from './slices/authSlice';
import kanbanSlice from './slices/kanbanSlice';
import uiSlice from './slices/uiSlice';

/**
 * Redux Store 配置
 * 
 * 原理说明：
 * 1. configureStore：RTK提供的store配置函数，内置了常用中间件
 * 2. reducer：将各个slice的reducer组合成根reducer
 * 3. middleware：自动包含redux-thunk，支持异步action
 * 4. devTools：开发环境下启用Redux DevTools
 */
export const store = configureStore({
  reducer: {
    auth: authSlice,      // 认证相关状态
    kanban: kanbanSlice,  // 看板相关状态
    ui: uiSlice,          // UI相关状态（loading、modal等）
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // 序列化检查配置
      serializableCheck: {
        // 忽略这些action类型的序列化检查
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  // 只在开发环境启用DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

// 设置监听器，用于RTK Query的缓存管理
setupListeners(store.dispatch);

// 导出类型，用于TypeScript类型推断
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 导出store实例
export default store; 