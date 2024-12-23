import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './JobSlice';

export const store = configureStore({
  reducer: {
    job: jobReducer
  },
});

export default store;