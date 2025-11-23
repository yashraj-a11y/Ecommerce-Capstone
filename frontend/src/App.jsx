import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./components/ Products/ProductDetails";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmatonPage from "./pages/OrderConfirmatonPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHomePAge from "./pages/AdminHomePAge";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProduct from "./components/Admin/EditProduct";
import OrderManagement from "./components/Admin/OrderManagement";
import Shop from "./components/Admin/Shop";

import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Routes>
          <Route path="/" element={<UserLayout />}>
            {/*User Layout*/}
            <Route index element={<Home />} />

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="collections/:collection"
              element={<CollectionPage />}
            />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmatonPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
          </Route>
          {/* <Route index element={<Home/>} /> */}

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePAge />}></Route>
            <Route path="users" element={<UserManagement />}></Route>
            <Route path="products" element={<ProductManagement />}></Route>
            <Route path="products/:id/edit" element={<EditProduct />}></Route>
            <Route path="orders" element={<OrderManagement />}></Route>
            <Route path="shop" element={<Shop />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
