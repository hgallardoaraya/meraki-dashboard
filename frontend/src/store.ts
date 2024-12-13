import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // Usa localStorage
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from './auth/authSlice';
import { useDispatch } from 'react-redux';

// Configuración para redux-persist
const persistConfig = {
  key: 'root', // Clave en el almacenamiento
  storage, // Usa localStorage como almacenamiento
};

// Combina los reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Aplica persistencia al reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura la tienda
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necesario para evitar errores con redux-persist
    }),
});

// Configura redux-persist para la tienda
export const persistor = persistStore(store);

// Tipos de despacho
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
