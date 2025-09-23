import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const ItinerarySection = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-[180vh] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      {/* First Section: Text on left, Image on right */}
      <div className='max-w-6xl flex flex-col md:flex-row items-center gap-8 mb-12'>
        {/* Text on the left */}
        <div className='md:w-1/2 text-left'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight'>
            Adjust your itinerary as needed
          </h2>
          <p className='text-gray-600 text-base sm:text-lg md:text-xl mb-6 max-w-prose'>
            Seamlessly manage your itinerary all in one page with Wonderplan - from reconfiguring the order of your plans, introducing new destinations to your itinerary, or even discarding plans as needed.
          </p>
          <button
            onClick={() => navigate('/tripplanner')}
            className='bg-amber-500 text-white px-6 py-3 rounded-md shadow-lg hover:bg-amber-600 transition-colors sm:px-8 sm:py-4 sm:text-lg'
          >
            Get Started
          </button>
        </div>
        {/* Image on the right */}
        <div className='md:w-1/2'>
          <img
            className='w-full h-auto rounded-lg shadow-lg object-cover'
            src={assets.header_img}
            alt='Itinerary Management'
          />
        </div>
      </div>

      {/* Second Section: Image on left, Text on right */}
      <div className='max-w-6xl flex flex-col md:flex-row items-center gap-8 mb-12'>
        {/* Image on the left */}
        <div className='md:w-1/2 order-2 md:order-1'>
          <img
            className='w-full h-auto rounded-lg shadow-lg object-cover'
            src={assets.about_image2}
            alt='Trip Planning'
          />
        </div>
        {/* Text on the right */}
        <div className='md:w-1/2 text-left order-1 md:order-2'>
          <h2 className='text-3xl text-center sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight'>
            Explore new destinations
          </h2>
          <p className='text-gray-600 text-center text-base sm:text-lg md:text-xl my-6 max-w-prose'>
            Discover exciting new places with Wonderplan, offering personalized suggestions based on your preferences and travel style.
          </p>
        </div>
      </div>

      {/* Third Section: Text and Button centered with bg-black */}
      <div className='max-w-9xl bg-black flex flex-col items-center justify-center gap-6 py-8 px-4 sm:px-6 lg:px-8 rounded-xl'>
        <div className='text-center'>
          <p className='text-gray-100 text-sm sm:text-base md:text-lg lg:text-xl my-4 sm:my-6 max-w-prose mx-auto'>
            Skip the manual trip planning and start your effortless journey with Trip Planner AI today, at no cost.
          </p>
          <button
            onClick={() => navigate('/tripplanner')}
            className='bg-amber-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg hover:bg-amber-600 transition-colors text-sm sm:text-base md:text-lg w-full sm:w-auto'
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItinerarySection;
