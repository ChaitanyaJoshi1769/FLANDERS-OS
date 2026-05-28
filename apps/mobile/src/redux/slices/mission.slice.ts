import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import { Mission, MissionState } from '../../types';

const initialState: MissionState = {
  missions: [],
  selectedMission: null,
  isLoading: false,
  error: null,
};

export const fetchMissions = createAsyncThunk(
  'mission/fetchMissions',
  async (organizationId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/autonomous/missions?organizationId=${organizationId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch missions');
    }
  }
);

const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    selectMission: (state, action) => {
      state.selectedMission = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.missions = action.payload;
      })
      .addCase(fetchMissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectMission } = missionSlice.actions;
export default missionSlice.reducer;
