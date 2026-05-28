import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../../services/api';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const initializeApp = createAsyncThunk('auth/initializeApp', async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await apiClient.get('/users/me');
      return { user: response.data, token };
    }
  } catch (error) {
    await SecureStore.deleteItemAsync('authToken');
  }
  return null;
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { access_token, user } = response.data;
    await SecureStore.setItemAsync('authToken', access_token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    return { user, token: access_token };
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await SecureStore.deleteItemAsync('authToken');
  delete apiClient.defaults.headers.common['Authorization'];
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initializeApp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeApp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to initialize';
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
