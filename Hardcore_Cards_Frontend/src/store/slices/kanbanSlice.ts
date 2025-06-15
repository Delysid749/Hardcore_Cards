import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { allKanban, kanbanContent, addKanban } from '../../services/index';

/**
 * 看板相关状态接口
 */
interface KanbanState {
  kanbans: any[];
  currentKanban: any | null;
  loading: boolean;
  error: string | null;
}

/**
 * 初始状态
 */
const initialState: KanbanState = {
  kanbans: [],
  currentKanban: null,
  loading: false,
  error: null,
};

/**
 * 异步获取所有看板
 */
export const fetchKanbans = createAsyncThunk(
  'kanban/fetchKanbans',
  async () => {
    const response = await allKanban();
    return response.data;
  }
);

/**
 * 异步获取看板详情
 */
export const fetchKanbanDetail = createAsyncThunk(
  'kanban/fetchKanbanDetail',
  async (kanbanId: string) => {
    const response = await kanbanContent(kanbanId);
    return response.data;
  }
);

/**
 * 异步创建看板
 */
export const createKanban = createAsyncThunk(
  'kanban/createKanban',
  async (kanbanData: any) => {
    const response = await addKanban(kanbanData);
    return response.data;
  }
);

/**
 * 看板Slice
 */
const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    /**
     * 清除错误
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * 设置当前看板
     */
    setCurrentKanban: (state, action: PayloadAction<any>) => {
      state.currentKanban = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 获取看板列表
    builder
      .addCase(fetchKanbans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKanbans.fulfilled, (state, action) => {
        state.loading = false;
        state.kanbans = action.payload;
      })
      .addCase(fetchKanbans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取看板列表失败';
      })
      
    // 获取看板详情
    builder
      .addCase(fetchKanbanDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKanbanDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKanban = action.payload;
      })
      .addCase(fetchKanbanDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取看板详情失败';
      })
      
    // 创建看板
    builder
      .addCase(createKanban.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKanban.fulfilled, (state, action) => {
        state.loading = false;
        state.kanbans.push(action.payload);
      })
      .addCase(createKanban.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建看板失败';
      });
  },
});

export const { clearError, setCurrentKanban } = kanbanSlice.actions;
export default kanbanSlice.reducer; 