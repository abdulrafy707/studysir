import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './jobSlice';

export const store = configureStore({
  reducer: {
    job: jobReducer,
  },
});

export default store;
