import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  updateCartItemQunatity,
  removeFromCart,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart = { products: [] }, userId, guestId }) => {
  const dispatch = useDispatch();


  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQunatity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };


  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };


  return (
    <div className="divide-y">
      {cart.products?.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="flex items-center justify-between py-4"
        >
          {/* Left: Image + Info */}
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover rounded-md mr-4"
            />

            <div>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {product.size} | Color: {product.color}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center mt-3">
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-lg font-medium hover:bg-gray-100"
                >
                  -
                </button>

                <span className="mx-3 text-lg">{product.quantity}</span>

                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      +1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-lg font-medium hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Right: Price + Remove */}
          <div className="flex items-center space-x-6">
            <p className="text-lg font-medium">${product.price}</p>

            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
              className="hover:text-red-700 transition"
            >
              <RiDeleteBin3Line className="h-6 w-6 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
