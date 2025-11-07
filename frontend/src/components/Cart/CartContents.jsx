import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";

const CartContents = () => {
  const cartProducts = [
    {
      productId: 1,
      name: "T-shirt",
      size: "M",
      color: "Red",
      quantity: 1,
      price: 15,
      image: "https://picsum.photos/200?random=1",
    },
    {
      productId: 2,
      name: "Jeans",
      size: "L",
      color: "Blue",
      quantity: 1,
      price: 35,
      image: "https://picsum.photos/200?random=2",
    },
    {
      productId: 3,
      name: "Trouser",
      size: "L",
      color: "Green",
      quantity: 1,
      price: 45,
      image: "https://picsum.photos/200?random=3",
    },
  ];

  return (
    <div className="divide-y">
      {cartProducts.map((product) => (
        <div
          key={product.productId}
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

              {/* Quantity controls */}
              <div className="flex items-center mt-3">
                <button className="border border-gray-300 rounded px-2 py-1 text-lg font-medium hover:bg-gray-100">
                  -
                </button>
                <span className="mx-3 text-lg">{product.quantity}</span>
                <button className="border border-gray-300 rounded px-2 py-1 text-lg font-medium hover:bg-gray-100">
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Right: Price + Delete */}
          <div className="flex items-center space-x-6">
            <p className="text-lg font-medium">${product.price}</p>
            <button className="hover:text-red-700 transition">
              <RiDeleteBin3Line className="h-6 w-6 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
