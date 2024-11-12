import { configureStore } from '@reduxjs/toolkit';
import { recipeSlice } from './features/recipeSlice';
import { signUpSlice } from './features/userSlice';

export const store = configureStore({
  reducer: {
    user: signUpSlice.reducer,
    recipe: recipeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
