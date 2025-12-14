import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

const usuariolocal = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: usuariolocal ? usuariolocal : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const registro = createAsyncThunk(
  'auth/registro',
  async (userData, thunkAPI) => {
    try {
      return await authService.registro(userData);
    } catch (error) {
      const mensaje =
        (error.response &&
          error.response.data &&
          error.response.data.mensaje) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(mensaje);
    }
  }
)

export const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
     reset: (state) => {
       state.isLoading = false;
       state.isSuccess = false;
       state.isError = false;
       state.message = '';
     },
   },
   extraReducers: builder => {
      builder
        .addCase(registro.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(registro.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload;
        })
        .addCase(registro.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          state.user = null;
        }) 
    }
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;