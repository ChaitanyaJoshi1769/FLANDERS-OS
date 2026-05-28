import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Fleet {
  id: string;
  name: string;
  organizationId: string;
  siteId: string;
  description?: string;
  fleetType?: string;
  totalMachines: number;
}

interface FleetState {
  fleets: Fleet[];
  selectedFleetId: string | null;
  isLoading: boolean;
}

const initialState: FleetState = {
  fleets: [],
  selectedFleetId: null,
  isLoading: false,
};

const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    setFleets: (state, action: PayloadAction<Fleet[]>) => {
      state.fleets = action.payload;
    },
    setSelectedFleet: (state, action: PayloadAction<string>) => {
      state.selectedFleetId = action.payload;
    },
    addFleet: (state, action: PayloadAction<Fleet>) => {
      state.fleets.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setFleets, setSelectedFleet, addFleet, setLoading } =
  fleetSlice.actions;
export default fleetSlice.reducer;
