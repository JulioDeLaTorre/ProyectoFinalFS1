import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../merkmale/autorisierung/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});