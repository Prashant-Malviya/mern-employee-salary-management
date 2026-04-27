import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        username: user.username,
        password: user.password
      }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        return thunkAPI.rejectWithValue(message);
      }
      return thunkAPI.rejectWithValue("Unable to connect to the server");
    }
  }
);

export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/me', {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
    return thunkAPI.rejectWithValue("Session check failed");
  }
});

export const logoutUser = createAsyncThunk("user/logoutUser", async (_, thunkAPI) => {
  try {
    const response = await axios.delete("http://127.0.0.1:5000/logout", {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
    return thunkAPI.rejectWithValue("Logout failed");
  }
});
