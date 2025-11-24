import React, { useEffect, useRef } from "react";
import { useState } from "react";
import {FaFilter} from 'react-icons/fa'
import FilterSidebar from "../components/ Products/FilterSidebar";
import SortOptions from "../components/ Products/SortOptions";
import ProductsGrid from "../components/ Products/ProductsGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import { useSelector } from "react-redux";

const CollectionPage = () => {

  const {collection} = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  const {products , loading , error} = useSelector((state) => state.products)
  const queryParams = Object.fromEntries([...searchParams])

  const sidebarRef = useRef(null)
  const [isSidebarOpen , setIsSidebarOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchProductsByFilters({collection , ...queryParams})) ;
  } , [dispatch , collection ,searchParams]) ;








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
      <ProductsGrid products={products} loading={loading} error= {error}/>

    </div>





  </div>
);
};

export default CollectionPage;
