"use client";
import React, { useEffect } from 'react';

const HomeLoading = () => {
  useEffect(() => {
    // Disable scroll on mount
    document.body.style.overflow = 'hidden';

    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='bg-black fixed inset-0 z-50 w-full left-0 top-0 h-screen'>
      <div className='w-full h-full !text-white text-3xl font-black flex justify-center items-center'>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default HomeLoading;
