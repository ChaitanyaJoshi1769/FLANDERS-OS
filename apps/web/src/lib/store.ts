import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/slices/authSlice';
import organizationReducer from '@/lib/slices/organizationSlice';
import fleetReducer from '@/lib/slices/fleetSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    fleet: fleetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
