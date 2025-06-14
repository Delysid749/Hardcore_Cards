import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Kanban, KanbanDetail, KanbanForm, Card, KanbanColumn } from '../../types';

/**
 * 看板状态接口定义
 * 
 * 原理说明：
 * 1. kanbans：用户的所有看板列表
 * 2. currentKanban：当前查看的看板详情
 * 3. loading：异步操作加载状态
 * 4. error：错误信息
 * 5. cooperating：是否处于协作状态（影响刷新频率）
 */
interface KanbanState {
  kanbans: Kanban[];
  currentKanban: KanbanDetail | null;
  loading: boolean;
  error: string | null;
  cooperating: boolean;
}

/**
 * 初始状态
 */
const initialState: KanbanState = {
  kanbans: [],
  currentKanban: null,
  loading: false,
  error: null,
  cooperating: false,
};

/**
 * 异步Action：获取用户的所有看板
 * 
 * 原理说明：
 * 对应原项目的 allKanban() API调用
 */
export const fetchKanbansAsync = createAsyncThunk(
  'kanban/fetchKanbans',
  async (_, { rejectWithValue }) => {
    try {
      // 这里后续会替换为实际的API调用
      const response = await fetch('/api/kanban');
      
      if (!response.ok) {
        throw new Error('获取看板列表失败');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '获取看板列表失败');
    }
  }
);

/**
 * 异步Action：获取看板详情
 * 
 * 原理说明：
 * 对应原项目的 kanbanContent() API调用
 */
export const fetchKanbanDetailAsync = createAsyncThunk(
  'kanban/fetchKanbanDetail',
  async (kanbanId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/kanban/content?kanbanId=${kanbanId}`);
      
      if (!response.ok) {
        throw new Error('获取看板详情失败');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '获取看板详情失败');
    }
  }
);

/**
 * 异步Action：创建新看板
 * 
 * 原理说明：
 * 对应原项目的 addKanban() API调用
 */
export const createKanbanAsync = createAsyncThunk(
  'kanban/createKanban',
  async (kanbanData: KanbanForm, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/kanban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kanbanData),
      });
      
      if (!response.ok) {
        throw new Error('创建看板失败');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '创建看板失败');
    }
  }
);

/**
 * 异步Action：收藏/取消收藏看板
 */
export const toggleKanbanCollectAsync = createAsyncThunk(
  'kanban/toggleCollect',
  async ({ kanbanId, isCollected }: { kanbanId: number; isCollected: boolean }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/kanban/collect?kanbanId=${kanbanId}&isCollected=${isCollected}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('操作失败');
      }
      
      return { kanbanId, isCollected };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '操作失败');
    }
  }
);

/**
 * Kanban Slice
 * 
 * 原理说明：
 * 管理看板相关的所有状态，包括列表、详情、协作状态等
 */
const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },
    
    // 设置协作状态
    setCooperating: (state, action: PayloadAction<boolean>) => {
      state.cooperating = action.payload;
      if (state.currentKanban) {
        state.currentKanban.cooperating = action.payload;
      }
    },
    
    // 清除当前看板
    clearCurrentKanban: (state) => {
      state.currentKanban = null;
      state.cooperating = false;
    },
    
    // 更新看板列表中的某个看板
    updateKanbanInList: (state, action: PayloadAction<Partial<Kanban> & { id: number }>) => {
      const index = state.kanbans.findIndex(k => k.id === action.payload.id);
      if (index !== -1) {
        state.kanbans[index] = { ...state.kanbans[index], ...action.payload };
      }
    },
    
    // 添加新看板到列表
    addKanbanToList: (state, action: PayloadAction<Kanban>) => {
      state.kanbans.unshift(action.payload);
    },
    
    // 从列表中移除看板
    removeKanbanFromList: (state, action: PayloadAction<number>) => {
      state.kanbans = state.kanbans.filter(k => k.id !== action.payload);
    },
    
    // 更新当前看板的列
    updateKanbanColumns: (state, action: PayloadAction<KanbanColumn[]>) => {
      if (state.currentKanban) {
        state.currentKanban.columns = action.payload;
      }
    },
    
    // 添加新列
    addColumn: (state, action: PayloadAction<KanbanColumn>) => {
      if (state.currentKanban) {
        state.currentKanban.columns.push(action.payload);
      }
    },
    
    // 更新卡片
    updateCard: (state, action: PayloadAction<Card>) => {
      if (state.currentKanban) {
        const column = state.currentKanban.columns.find(col => 
          col.cards.some(card => card.id === action.payload.id)
        );
        if (column) {
          const cardIndex = column.cards.findIndex(card => card.id === action.payload.id);
          if (cardIndex !== -1) {
            column.cards[cardIndex] = action.payload;
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    // 获取看板列表
    builder
      .addCase(fetchKanbansAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKanbansAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.kanbans = action.payload;
      })
      .addCase(fetchKanbansAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 获取看板详情
    builder
      .addCase(fetchKanbanDetailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKanbanDetailAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKanban = action.payload;
        state.cooperating = action.payload.cooperating;
      })
      .addCase(fetchKanbanDetailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 创建看板
    builder
      .addCase(createKanbanAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createKanbanAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.kanbans.unshift(action.payload);
      })
      .addCase(createKanbanAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 收藏/取消收藏
    builder
      .addCase(toggleKanbanCollectAsync.fulfilled, (state, action) => {
        const { kanbanId, isCollected } = action.payload;
        const kanban = state.kanbans.find(k => k.id === kanbanId);
        if (kanban) {
          kanban.collected = isCollected;
        }
      });
  },
});

// 导出action creators
export const {
  clearError,
  setCooperating,
  clearCurrentKanban,
  updateKanbanInList,
  addKanbanToList,
  removeKanbanFromList,
  updateKanbanColumns,
  addColumn,
  updateCard,
} = kanbanSlice.actions;

// 导出reducer
export default kanbanSlice.reducer; 