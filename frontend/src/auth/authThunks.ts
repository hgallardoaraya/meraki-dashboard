import { createAsyncThunk } from '@reduxjs/toolkit';
import { setError, setLoading, setLoggedIn, setRole, setToken, setUsername } from './authSlice';
import axios from 'axios';
import { decodeToken } from '@/helpers/token';

type TokenPayload = {
  role: string,
  username: string,
}

// Acción para realizar login
export const login = createAsyncThunk('login', async (credentials:{username: string, password: string}, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
    const token = response.data.token;
    dispatch(setToken(token));   
    const payload = decodeToken(token);
    if(payload) {
      if("username" in payload) {
        dispatch(setUsername(payload.username as string))
      }
      if("role" in payload) {
        dispatch(setRole(payload.role as string));
      }
    }
    dispatch(setLoggedIn(true));
  } catch (error:any) {    
    dispatch(setError(error.response.data.error));  
    return Promise.reject("error al iniciar sesión"); // Devuelve el error para ser capturado en el componente
  } finally {
    dispatch(setLoading(false));
  }
});
