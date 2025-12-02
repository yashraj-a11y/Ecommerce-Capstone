import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from 'react-icons/fa'
import FilterSidebar from "../components/ Products/FilterSidebar";
import SortOptions from "../components/ Products/SortOptions";
import ProductsGrid from "../components/ Products/ProductsGrid";
import Pagination from "../components/Common/Pagination";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import { useSelector } from "react-redux";

const CollectionPage = () => {

  const { collection } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()

  const { products, loading, error, pagination } = useSelector((state) => state.products)
  const queryParams = Object.fromEntries([...searchParams])

  const sidebarRef = useRef(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    // Fetch products with pagination
    dispatch(fetchProductsByFilters({
      collection,
      ...queryParams,
      page: currentPage
    }));
  }, [dispatch, collection, searchParams]);

  // Handle page change
  const handlePageChange = (newPage) => {
    // Update URL with new page number
    setSearchParams({
      ...queryParams,
      page: newPage
    });

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when filters change (except page parameter)
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    delete params.page;

    const filterString = JSON.stringify(params);

    // If filters changed and we're not on page 1, reset to page 1
    if (currentPage !== 1 && Object.keys(params).length > 0) {
      const hasRealFilters = Object.values(params).some(val => val !== '');
      if (hasRealFilters) {
        // Don't reset immediately to avoid infinite loop
        // This will be handled by the component's natural flow
      }
    }
  }, [searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleClickOutside = (e) => {
    // close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false)
    }
  }

  useEffect(() => {
    // add Event listener for clicks
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    };
    // clean event listener
  }, []);

  return (
    <div className='flex flex-col lg:flex-row '>
      {/* mobile Filter button */}
      <button onClick={toggleSidebar}
        className='lg:hidden border p-2 flex justify-center items-center'>
        <FaFilter className="mr-2" />Filters
      </button>

      {/* Filter Sidebar */}
      <div ref={sidebarRef}
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0
        `}
      >
        <FilterSidebar />
      </div>

      <div className='flex-grown p-4 w-full'>
        <h2 className='text-2xl uppercase mb-4'>All Collections</h2>

        {/* sort options */}
        <SortOptions />

        {/* Product Grid */}
        <ProductsGrid products={products} loading={loading} error={error} />

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CollectionPage;

