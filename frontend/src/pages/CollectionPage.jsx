import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {FaFilter} from 'react-icons/fa'
import FilterSidebar from "../components/ Products/FilterSidebar";
import SortOptions from "../components/ Products/SortOptions";
import ProductsGrid from "../components/ Products/ProductsGrid";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);

  const sidebarRef = useRef(null) ;
  const [isSidebarOpen , setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)

  }

  const handleClickOutside = (e) => {
    // close sidebar if clicked outside

    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false)
    }
  } 

  useEffect (() => {
    // add Event listener for clicks
    document.addEventListener('mousedown' , handleClickOutside)


    return () => {
      document.removeEventListener('mousedown',handleClickOutside)

    } ;
    // clean event listener
    

  },[]);



  
  useEffect(() => {
      setTimeout(() => {
        const fetchedProducts = [
          {
            _id: 1,
            name: "Product 1",
            price: 253,
            image: [{ url: "https://picsum.photos/500/500?random=48" }],
          },
          {
            _id: 2,
            name: "Product 2",
            price: 193,
            image: [{ url: "https://picsum.photos/500/500?random=47" }],
          },
          {
            _id: 3,
            name: "Product 3",
            price: 28243,
            image: [{ url: "https://picsum.photos/500/500?random=46" }],
          },
          {
            _id: 4,
            name: "Product 4",
            price: 3643,
            image: [{ url: "https://picsum.photos/500/500?random=45" }],
          },
          {
            _id: 5,
            name: "Product 5",
            price: 2353,
            image: [{ url: "https://picsum.photos/500/500?random=49" }],
          },
          {
            _id: 6,
            name: "Product 6",
            price: 1193,
            image: [{ url: "https://picsum.photos/500/500?random=50" }],
          },
          {
            _id: 7,
            name: "Product 7",
            price: 2283,
            image: [{ url: "https://picsum.photos/500/500?random=51" }],
          },
          {
            _id: 8,
            name: "Product 8",
            price: 2363,
            image: [{ url: "https://picsum.photos/500/500?random=52" }],
          },
        ];
        setProducts(fetchedProducts)
      },1000);
    },[]);


  return (
  <div className='flex flex-col lg:flex-row '>
    {/* mobile Filter button */}
    <button onClick={toggleSidebar}
    className='lg:hidden border p-2 flex justify-center items-center'>
      <FaFilter className="mr-2"/>Filters

    </button>

    {/* Filter Sidebar */}
    <div ref={sidebarRef}
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0
        `}
    >
      <FilterSidebar />
    </div>

    <div className='flex-grown p-4 '>
      <h2 className='text-2xl uppercase mb-4'>All Collections</h2>

      {/* sort options */}
      <SortOptions />


      {/* Product Grid */}
      <ProductsGrid products={products}/>

    </div>





  </div>
);
};

export default CollectionPage;
