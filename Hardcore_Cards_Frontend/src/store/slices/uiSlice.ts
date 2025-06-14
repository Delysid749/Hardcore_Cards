import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  globalLoading: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  modals: {
    createKanban: boolean;
    editKanban: boolean;
    createCard: boolean;
    editCard: boolean;
    userProfile: boolean;
    invitation: boolean;
  };
}

const initialState: UIState = {
  globalLoading: false,
  sidebarCollapsed: false,
  theme: 'light',
  modals: {
    createKanban: false,
    editKanban: false,
    createCard: false,
    editCard: false,
    userProfile: false,
    invitation: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    showModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    hideModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
  },
});

export const { setGlobalLoading, toggleSidebar, showModal, hideModal } = uiSlice.actions;
export default uiSlice.reducer; 