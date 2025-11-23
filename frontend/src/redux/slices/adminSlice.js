import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ---------------------------------------------------------
   FETCH ALL USERS (ADMIN ONLY)
---------------------------------------------------------- */
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  return response.data;
});

/* ---------------------------------------------------------
   ADD USER
---------------------------------------------------------- */
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data; // FIXED
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

/* ---------------------------------------------------------
   UPDATE USER
---------------------------------------------------------- */
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        { name, email, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data; // FIXED
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

/* ---------------------------------------------------------
   DELETE USER
---------------------------------------------------------- */
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);

/* ---------------------------------------------------------
   SLICE
---------------------------------------------------------- */

const adminSlice = createSlice({
  name: "admin",

  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* ---------------- Fetch Users ---------------- */
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      /* ---------------- Add User ---------------- */
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // FIXED
      })

      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- Update User ---------------- */
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        const index = state.users.findIndex((u) => u._id === updated._id);
        if (index !== -1) {
          state.users[index] = updated;
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------------- Delete User ---------------- */
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
