import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * 类型安全的Redux Hooks
 * 
 * 原理说明：
 * 1. useAppDispatch：类型安全的dispatch hook
 * 2. useAppSelector：类型安全的selector hook
 * 3. TypeScript会自动推断state的类型
 * 4. 避免在每个组件中重复定义类型
 */

// 使用类型化的dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 使用类型化的selector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * 常用的selector hooks
 * 
 * 原理说明：
 * 预定义常用的selector，减少重复代码
 */

// 认证相关selectors
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);

// 看板相关selectors
export const useKanbans = () => useAppSelector((state) => state.kanban.kanbans);
export const useCurrentKanban = () => useAppSelector((state) => state.kanban.currentKanban);
export const useKanbanLoading = () => useAppSelector((state) => state.kanban.loading);
export const useCooperating = () => useAppSelector((state) => state.kanban.loading);

// UI相关selectors
export const useGlobalLoading = () => useAppSelector((state) => state.ui.globalLoading);
export const useSidebarCollapsed = () => useAppSelector((state) => state.ui.sidebarCollapsed);
export const useTheme = () => useAppSelector((state) => state.ui.theme);
export const useModals = () => useAppSelector((state) => state.ui.modals); 