import {
  createSlice,
  createAsyncThunk,
  __DO_NOT_USE__ActionTypes,
} from "@reduxjs/toolkit";

import axios from "axios";

// Async all orders by admin only

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (__DO_NOT_USE__ActionTypes, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// /Async thunk to update order delivery status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      return response.data; // updated order object
    } catch (error) {
        console.log(error)
      return rejectWithValue(error.response?.data || { message: "Error updating order" });
    }
  }
);

// Delete an order

export const deleteOrder = createAsyncThunk(
  "adminProducts/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (err) {}
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;

        // calculate total sales
        const totalSales = action.payload.reduce((acc, order) => {
          return acc + order.totalPrice;
        }, 0);

        state.totalSales = totalSales;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      //  update the order
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.statusUpdating = false;
        state.successUpdate = true;

        const index = state.orders.findIndex((o) => o._id === updatedOrder._id);

        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })

      // Delete an order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
      });
  },
});

export default adminOrderSlice.reducer;
