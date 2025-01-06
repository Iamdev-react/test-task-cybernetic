import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('https://dummyjson.com/users');
  return response.data;
});

export const fetchUserDetails = createAsyncThunk('users/fetchUsers', async (id) => {
  const response = await axios.get(`https://dummyjson.com/user/${id}`);
  return response.data;
});

const initialState = {
  users: [],
  status: ""
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.users = []
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        const response = action.payload;
        if (response.users && response.users.length) {
          state.status = 'succeeded';
          state.users = response.users;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.users = []

      });
  },
});

export default userSlice.reducer;
