import {  login, signUp } from '@/apiServices/User';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id?: string;
  username: string;
  password: string;
  email: string;
  favourites?: string[];
}

interface UserState {
  user: User[];
}

const initialState: UserState = {
  user: [],
};

export const signUpSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      postSignUp.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user.push(action.payload);
      }
    );

    builder.addCase(
      postLogIn.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.user = [action.payload];
      }
    );
    builder.addCase(
      getLoggedInUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        if (action.payload) {
          state.user = [action.payload];
        }
      }
    );

  },
});

export const postSignUp = createAsyncThunk(
  'user/SignUp',
  async (data: User) => {
    const response = await signUp(data);
    return response;
  }
);

export const postLogIn = createAsyncThunk(
  'user/login',
  async (data: Partial<User>) => {
    const response = await login(data);
    return response;
  }
);

export const getLoggedInUser = createAsyncThunk('loggedInUser', async () => {
  const response = localStorage.getItem('user');
  if (response) {
    return JSON.parse(response);
  }
});



// export const favourites=createAsyncThunk()

export default signUpSlice.reducer;
