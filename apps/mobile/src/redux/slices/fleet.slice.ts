import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api';

interface Fleet {
  id: string;
  name: string;
  status: string;
  machineCount: number;
}

interface FleetState {
  fleets: Fleet[];
  selectedFleet: Fleet | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FleetState = {
  fleets: [],
  selectedFleet: null,
  isLoading: false,
  error: null,
};

export const fetchFleets = createAsyncThunk('fleet/fetchFleets', async (organizationId: string) => {
  const response = await apiClient.get(`/fleets/organization/${organizationId}`);
  return response.data;
});

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    setSelectedFleet: (state, action) => {
      state.selectedFleet = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFleets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFleets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fleets = action.payload;
      })
      .addCase(fetchFleets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch fleets';
      });
  },
});

export const { setSelectedFleet } = fleetSlice.actions;
export default fleetSlice.reducer;
