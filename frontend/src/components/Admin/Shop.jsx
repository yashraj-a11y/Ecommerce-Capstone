import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/'); // ✅ Navigate only after component mounts
  }, [navigate]);

  return null; // or return a loading spinner if you want
};

export default Shop;
