import { configureStore, createReducer } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'
import cartReducer from './slices/cartSlice'
import checkoutReducer from './slices/checkoutSlice'
import orderReducer from './slices/orderSlice'
import adminReducer from './slices/adminSlice'
import adminProductReducer from './slices/adminProductSlice'
import adminOrderReducer from './slices/adminOrdersSlice'




// import { checkout } from '../../../backend/routes/uploadRoutes'

const store = configureStore({
  reducer: {
    auth: authReducer,
    products : productReducer ,
    cart : cartReducer ,
    checkoutc: checkoutReducer ,
    orders : orderReducer ,
    admin : adminReducer ,
    adminReducer : adminProductReducer ,
    adminReducer : adminOrderReducer 
   

  },
})

export default store
