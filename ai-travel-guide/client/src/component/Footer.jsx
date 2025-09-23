// import React from 'react';
// import { NavLink } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className='bg-gray-900 bottom-0 text-white py-6 px-4 sm:py-8 sm:px-6 lg:px-8'>
//       <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
//         {/* Company Info */}
//         <div className='mb-6 sm:mb-0'>
//           <h3 className='text-lg sm:text-xl text-amber-500 md:text-2xl font-bold mb-3 sm:mb-4'>GoGuidaAi</h3>
//           <p className='text-gray-400 text-xs sm:text-sm md:text-base'>
//             Your personal AI-powered trip planner, crafting unforgettable itineraries tailored to your needs.
//           </p>
//         </div>

//         {/* Quick Links */}
//         <div className='mb-6 sm:mb-0'>
//           <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4'>Quick Links</h3>
//           <ul className='space-y-2'>
//             <li>
//               <NavLink to='/' className='text-gray-400 hover:text-amber-500 transition-colors text-xs sm:text-sm md:text-base'>
//                 Home
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to='/tripplanner' className='text-gray-400 hover:text-amber-500 transition-colors text-xs sm:text-sm md:text-base'>
//                 Trip Planner
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to='/trips' className='text-gray-400 hover:text-amber-500 transition-colors text-xs sm:text-sm md:text-base'>
//                 Trips
//               </NavLink>
//             </li>
//             <li>
//               <NavLink to='/blogs' className='text-gray-400 hover:text-amber-500 transition-colors text-xs sm:text-sm md:text-base'>
//                 Blogs
//               </NavLink>
//             </li>
//           </ul>
//         </div>

//         {/* Social Media */}
//         <div>
//           <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4'>Follow Us</h3>
//           <div className='flex space-x-3 sm:space-x-4'>
//             <a href='#' className='text-gray-400 hover:text-amber-500 transition-colors'>
//               <span className='sr-only'>Facebook</span>
//               <svg className='w-5 sm:w-6 h-5 sm:h-6' fill='currentColor' viewBox='0 0 24 24'>
//                 <path d='M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z'/>
//               </svg>
//             </a>
//             <a href='#' className='text-gray-400 hover:text-amber-500 transition-colors'>
//               <span className='sr-only'>Twitter</span>
//               <svg className='w-5 sm:w-6 h-5 sm:h-6' fill='currentColor' viewBox='0 0 24 24'>
//                 <path d='M23 3a10.9 10.9 0 01-3.14 2.6 4.75 4.75 0 00-8.51 3.21A13.45 13.45 0 011.2 3.9a4.82 4.82 0 001.5 6.42A4.72 4.72 0 01.8 9.6a4.75 4.75 0 003.96 5.22 4.74 4.74 0 01-2.14.08 4.77 4.77 0 004.45 3.3 9.53 9.53 0 01-7 2.1 13.4 13.4 0 007.29 2.14c8.76 0 13.56-7.25 13.56-13.55 0-.2 0-.4-.02-.6A9.7 9.7 0 0023 3z'/>
//               </svg>
//             </a>
//             <a href='#' className='text-gray-400 hover:text-amber-500 transition-colors'>
//               <span className='sr-only'>Instagram</span>
//               <svg className='w-5 sm:w-6 h-5 sm:h-6' fill='currentColor' viewBox='0 0 24 24'>
//                 <path d='M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.327 3.608 1.302.975.975 1.24 2.242 1.302 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.327 2.633-1.302 3.608-.975.975-2.242 1.24-3.608 1.302-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.327-3.608-1.302-.975-.975-1.24-2.242-1.302-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.327-2.633 1.302-3.608.975-.975 2.242-1.24 3.608-1.302 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.67.014-4.95.072-1.315.064-2.553.343-3.496 1.286-.943.943-1.222 2.181-1.286 3.496-.058 1.28-.072 1.691-.072 4.95s.014 3.67.072 4.95c.064 1.315.343 2.553 1.286 3.496.943.943 2.181 1.222 3.496 1.286 1.28.058 1.691.072 4.95.072s3.67-.014 4.95-.072c1.315-.064 2.553-.343 3.496-1.286.943-.943 1.222-2.181 1.286-3.496.058-1.28.072-1.691.072-4.95s-.014-3.67-.072-4.95c-.064-1.315-.343-2.553-1.286-3.496-.943-.943-2.181-1.222-3.496-1.286-1.28-.058-1.691-.072-4.95-.072z'/>
//                 <path d='M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'/>
//               </svg>
//             </a>
//           </div>
//         </div>
//       </div>
//       <div className='mt-6 sm:mt-8 border-t border-gray-800 pt-4 text-center text-gray-400 text-xs sm:text-sm'>
//         <p>&copy; {new Date().getFullYear()} GoGuidaAi. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-white py-6 px-4 sm:py-8 sm:px-6 lg:px-8'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
        {/* Company Info */}
        <div className='mb-6 sm:mb-0'>
          <h3 className='text-lg sm:text-xl text-amber-500 md:text-2xl font-bold mb-3 sm:mb-4'>GoGuidaAi</h3>
          <p className='text-gray-400 text-xs sm:text-sm md:text-base'>
            Your personal AI-powered trip planner, crafting unforgettable itineraries tailored to your needs.
          </p>
        </div>

        {/* Quick Links */}
        <div className='mb-6 sm:mb-0'>
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4'>Quick Links</h3>
          <ul className='space-y-2'>
            <li>
              <NavLink to='/' className='text-gray-400 hover:text-amber-500 transition-colors text-xs sm:text-sm md:text-base'>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to='/tripplanner' className='text-gray-400 hover:text-amber-500 transition-colors text-xs sm:text-sm md:text-base'>
                Trip Planner
              </NavLink>
            </li>
            <li>
              <NavLink to='/trips' className='text-gray-400 hover:text-amber-500 transition-colors text-xs sm:text-sm md:text-base'>
                Trips
              </NavLink>
            </li>
            <li>
              <NavLink to='/blogs' className='text-gray-400 hover:text-amber-500 transition-colors text-xs sm:text-sm md:text-base'>
                Blogs
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className='text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4'>Follow Us</h3>
          <div className='flex space-x-3 sm:space-x-4'>
            <a href='#' className='text-gray-400 hover:text-amber-500 transition-colors'>
              <span className='sr-only'>Facebook</span>
              <svg className='w-5 sm:w-6 h-5 sm:h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z'/>
              </svg>
            </a>
            <a href='#' className='text-gray-400 hover:text-amber-500 transition-colors'>
              <span className='sr-only'>Twitter</span>
              <svg className='w-5 sm:w-6 h-5 sm:h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M23 3a10.9 10.9 0 01-3.14 2.6 4.75 4.75 0 00-8.51 3.21A13.45 13.45 0 011.2 3.9a4.82 4.82 0 001.5 6.42A4.72 4.72 0 01.8 9.6a4.75 4.75 0 003.96 5.22 4.74 4.74 0 01-2.14.08 4.77 4.77 0 004.45 3.3 9.53 9.53 0 01-7 2.1 13.4 13.4 0 007.29 2.14c8.76 0 13.56-7.25 13.56-13.55 0-.2 0-.4-.02-.6A9.7 9.7 0 0023 3z'/>
              </svg>
            </a>
            <a href='#' className='text-gray-400 hover:text-amber-500 transition-colors'>
              <span className='sr-only'>Instagram</span>
              <svg className='w-5 sm:w-6 h-5 sm:h-6' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.327 3.608 1.302.975.975 1.24 2.242 1.302 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.327 2.633-1.302 3.608-.975.975-2.242 1.24-3.608 1.302-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.327-3.608-1.302-.975-.975-1.24-2.242-1.302-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.327-2.633 1.302-3.608.975-.975 2.242-1.24 3.608-1.302 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.67.014-4.95.072-1.315.064-2.553.343-3.496 1.286-.943.943-1.222 2.181-1.286 3.496-.058 1.28-.072 1.691-.072 4.95s.014 3.67.072 4.95c.064 1.315.343 2.553 1.286 3.496.943.943 2.181 1.222 3.496 1.286 1.28.058 1.691.072 4.95.072s3.67-.014 4.95-.072c1.315-.064 2.553-.343 3.496-1.286.943-.943 1.222-2.181 1.286-3.496.058-1.28.072-1.691.072-4.95s-.014-3.67-.072-4.95c-.064-1.315-.343-2.553-1.286-3.496-.943-.943-2.181-1.222-3.496-1.286-1.28-.058-1.691-.072-4.95-.072z'/>
                <path d='M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z'/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className='mt-6 sm:mt-8 border-t border-gray-800 pt-4 text-center text-gray-400 text-xs sm:text-sm'>
        <p>&copy; {new Date().getFullYear()} GoGuidaAi. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;