import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import fleetReducer from './slices/fleet.slice';
import machineReducer from './slices/machine.slice';
import missionReducer from './slices/mission.slice';
import incidentReducer from './slices/incident.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    fleet: fleetReducer,
    machine: machineReducer,
    mission: missionReducer,
    incident: incidentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
