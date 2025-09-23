// import React from 'react'
// import { useNavigate } from 'react-router-dom';
// import { assets } from '../assets/assets';
// const Blogs = () => {
//   return (
//     <div className='min-h-[120vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
//       <div className="text-center">
//         <h1 className='text-5xl font-bold'>The Go Guida Ai Blog</h1>
//         <p className='text-xl py-3'>Travel Guides, Tips, Insights, & More</p>
//       </div>
//       <div className='max-w-6xl flex flex-col md:flex-row items-center gap-8 mb-12'>
//         {/* left */}
//         <div className='md:w-1/2 text-left'>
//           <img alt='' src={assets.blog1} />
//           <h1 className='text-3xl'>Google Maps Saved Places: The Essential Traveler's Guide</h1>
//           <p>By Cody Slingerland</p>
//           <p className='text-gray-600 text-base sm:text-lg md:text-xl mb-6 max-w-prose'>
//           Master Google Maps Saved Places for better travel organization and discover Wandrly, a powerful alternative with advanced features for serious travelers.    
//           </p>
          
//         </div>
//         {/*  right */}
//         <div className='md:w-1/2'>
//           <div className="">
//           <img
//             className='w-full h-auto rounded-lg shadow-lg object-cover'
//             src={assets.blog3}
//             alt='Itinerary Management'
//           />
//           <div className="">
//           <h1>15 AI Trip Planning Apps Worth Using In 2025</h1>
//           <p>By Cody Slingerland</p>
//           <p>Explore cutting-edge AI travel planners that create perfect itineraries in seconds, uncover hidden gems, and save you money on your 2025 adventures.</p>
//           </div>
//           </div>
//           <div className="">
//           <img
//             className='w-full h-auto rounded-lg shadow-lg object-cover'
//             src={assets.blog2}
//             alt='Itinerary Management'
//           />
//           <div className="">
//           <h1>25+ Top Travel Blogs You Must Read In 2025 (Expert Picks)</h1>
//           <p>By Cody Slingerland</p>
//           <p>Discover 25+ expert travel blogs for every style — from budget backpackers to luxury seekers. Your 2025 adventures start here!</p>
//           </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Blogs
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Blogs = () => {
  return (
    <div className='min-h-[120vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className="text-center mb-12">
        <h1 className='text-5xl font-bold text-gray-900'>The Go Guida Ai Blog</h1>
        <p className='text-xl text-gray-600 py-2'>Travel Guides, Tips, Insights, & More</p>
      </div>
      <div className='max-w-6xl flex flex-col md:flex-row items-start gap-8 mb-12'>
        {/* left */}
        <div className='md:w-1/2 w-full text-left'>
          <img className='w-full h-auto rounded-lg shadow-md object-cover mb-4' alt='' src={assets.blog1} />
          <h1 className='text-5xl font-semibold text-gray-900 mb-2'>Google Maps Saved Places: The Essential Traveler's Guide</h1>
          <p className='text-gray-500 mb-2'>By Cody Slingerland</p>
          <p className='text-gray-700 text-base sm:text-lg md:text-xl mb-6 max-w-prose leading-relaxed'>
            Master Google Maps Saved Places for better travel organization and discover Wandrly, a powerful alternative with advanced features for serious travelers.
          </p>
        </div>
        {/* right */}
        <div className='md:w-1/2 py-11 w-full'>
          <div className='mb-6'>
            <img
              className='w-full h-64 rounded-lg shadow-md object-cover mb-4'
              src={assets.blog3}
              alt='Itinerary Management'
            />
            <div className='space-y-2'>
              <h1 className='text-2xl font-semibold text-gray-900'>15 AI Trip Planning Apps Worth Using In 2025</h1>
              <p className='text-gray-500'>By Cody Slingerland</p>
              <p className='text-gray-700 text-base leading-relaxed'>
                Explore cutting-edge AI travel planners that create perfect itineraries in seconds, uncover hidden gems, and save you money on your 2025 adventures.
              </p>
            </div>
          </div>
          <div className='mb-6'>
            <img
              className='w-full h-64 rounded-lg shadow-md object-cover mb-4'
              src={assets.blog2}
              alt='Itinerary Management'
            />
            <div className='space-y-2'>
              <h1 className='text-2xl font-semibold text-gray-900'>25+ Top Travel Blogs You Must Read In 2025 (Expert Picks)</h1>
              <p className='text-gray-500'>By Cody Slingerland</p>
              <p className='text-gray-700 text-base leading-relaxed'>
                Discover 25+ expert travel blogs for every style — from budget backpackers to luxury seekers. Your 2025 adventures start here!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;