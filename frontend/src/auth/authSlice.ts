import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
  isLoggedIn: boolean,
  role: string,
  username: string,
  token: string | null,
  error: string | null,
  loading: boolean,
}

const initialState:AuthState = {
  isLoggedIn: false,
  role: 'ADMIN',
  username: '',
  token: null,
  error: null,
  loading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state:AuthState, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setRole: (state:AuthState, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    setUsername: (state:AuthState, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setToken: (state:AuthState, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setError: (state:AuthState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state:AuthState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state: AuthState) => {
      state.isLoggedIn = false;
      state.role = '';
      state.username = '';
      state.token = null;
      state.error = null;
      state.loading = false;
    }, 
  },
});

export type { AuthState }
export const { setToken, setRole, setUsername, setLoggedIn, setError, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
