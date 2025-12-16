import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/autenticacion/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});