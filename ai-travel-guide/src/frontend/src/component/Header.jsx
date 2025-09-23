import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  return (
    <div className='min-h-[80vh] flex items-center justify-center bg-white text-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl'>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
          Craft Unforgettable <br className='hidden sm:block' /> Itineraries with{' '}
          <br className='hidden sm:block' />
          <span className='text-orange-400 font-extrabold'>AI Trip Planner</span>
        </h1>
        <p className='text-gray-600 text-base sm:text-lg md:text-xl mb-6 max-w-md mx-auto'>
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>
        <button
          onClick={() => navigate('/tripplanner')}
          className='bg-black text-white px-6 py-3 rounded-md shadow-lg hover:bg-gray-800 transition-colors sm:px-8 sm:py-4 sm:text-lg'
        >
          Get started—it’s free
        </button>
      </div>
    </div>
  );
};

export default Header;