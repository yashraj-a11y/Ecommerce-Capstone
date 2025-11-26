

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";



// async thunk to fetch admin products

export const fetchAdminProducts = createAsyncThunk("admin/fetchAdminProducts", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    }
  );
  // console.log(response)
  return response.data;
});


export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
        productData ,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data 
      ;
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
  }
);

export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({id , productData}) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,
        productData ,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data)
    }
  }
);

export const deleteProduct = createAsyncThunk('adminProducts/deleteProduct' , async(id) => {
    
        await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,

            {
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('userToken')}`
                } ,
            }
        )
        return id ;
      
}) ;

const adminProductSlice = createSlice({
    name : 'adminProducts' ,
    initialState : {
        products : [] ,
        loading : false ,
        error : null
    } ,
    reducers : {} ,
    extraReducers : (builder) => {
        builder
        .addCase(fetchAdminProducts.pending , (state) => {
                state.loading = true ;
                
        })
        .addCase(fetchAdminProducts.fulfilled , (state,action) => {
                state.loading = false ;
                state.products = action.payload
                ;
        })
        .addCase(fetchAdminProducts.rejected , (state,action) => {
                state.loading = false ;
                state.error = action.error.message ;
        })


        // 

        .addCase(createProduct.fulfilled , (state,action) => {
            
            state.products.push(action.payload) 
        }) 


    

            
            .addCase(updateProduct.fulfilled , (state,action) => {
                
                const index = state.products.findIndex(
                    (product) => product._id === action.payload._id
                ) ;
               
                if (index !== -1) {
                    state.products[index] = action.payload ;
                }
            })

        // Delete a user
        .addCase(deleteProduct.fulfilled , (state , action) => {
            state.products = state.products.filter((product) => product._id !== action.payload) ;

        })
        
    }
}) ;

export default adminProductSlice.reducer ;