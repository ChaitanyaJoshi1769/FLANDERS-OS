import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/api';
import { Incident, IncidentState } from '../../types';

const initialState: IncidentState = {
  incidents: [],
  selectedIncident: null,
  isLoading: false,
  error: null,
};

export const fetchIncidents = createAsyncThunk(
  'incident/fetchIncidents',
  async (organizationId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/safety/incidents?organizationId=${organizationId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch incidents');
    }
  }
);

const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    selectIncident: (state, action) => {
      state.selectedIncident = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIncidents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.incidents = action.payload;
      })
      .addCase(fetchIncidents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectIncident } = incidentSlice.actions;
export default incidentSlice.reducer;
