import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import { Machine, MachineState } from '../../types';

const initialState: MachineState = {
  machines: [],
  selectedMachine: null,
  isLoading: false,
  error: null,
};

export const fetchMachines = createAsyncThunk(
  'machine/fetchMachines',
  async (organizationId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/machines?organizationId=${organizationId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch machines');
    }
  }
);

const machineSlice = createSlice({
  name: 'machine',
  initialState,
  reducers: {
    selectMachine: (state, action) => {
      state.selectedMachine = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMachines.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.isLoading = false;
        state.machines = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectMachine } = machineSlice.actions;
export default machineSlice.reducer;
