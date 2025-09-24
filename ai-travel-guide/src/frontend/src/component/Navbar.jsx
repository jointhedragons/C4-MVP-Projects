// import React, { useState, useEffect, useRef } from 'react';
// import { assets } from '../assets/assets';
// import { NavLink, useNavigate } from 'react-router-dom';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [showMenu, setShowMenu] = useState(false);
//   const [token, setToken] = useState(true);
//   const menuRef = useRef(null);

//   // Handle click outside to close menu
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showMenu]);

//   // Handle escape key to close menu
//   useEffect(() => {
//     const handleEscapeKey = (event) => {
//       if (showMenu && event.key === 'Escape') {
//         setShowMenu(false);
//       }
//     };
//     document.addEventListener('keydown', handleEscapeKey);
//     return () => document.removeEventListener('keydown', handleEscapeKey);
//   }, [showMenu]);

//   return (
//     <div className='flex items-center justify-between text-sm py-4 px-6 mb-5 border-b border-gray-200 bg-gray-50 shadow-md'>
//       <NavLink to='/' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
//         <h2 className='text-3xl text-amber-500 font-bold'>GoGuidaAi</h2>
//       </NavLink>
//       <ul className='hidden md:flex items-center gap-6 font-medium text-gray-700'>
//         <NavLink to='/' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
//           <li className='py-2 text-xs md:text-lg hover:text-amber-500 transition-colors'>Home</li>
//         </NavLink>
//         <NavLink to='/tripplanner' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
//           <li className='py-2 text-xs md:text-lg hover:text-amber-500 transition-colors'>Trip Planner</li>
//         </NavLink>
//         <NavLink to='/trips' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
//           <li className='py-2 text-xs md:text-lg hover:text-amber-500 transition-colors'>Trips</li>
//         </NavLink>
//         <NavLink to='/blogs' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
//           <li className='py-2 text-xs md:text-lg hover:text-amber-500 transition-colors'>Blogs</li>
//         </NavLink>
//       </ul>
//       <div className='flex items-center gap-4'>
//         <img
//           onClick={() => setShowMenu(!showMenu)}
//           className='w-6 h-6 md:hidden cursor-pointer transition-transform duration-200 hover:scale-110'
//           src={assets.menu_icon}
//           alt='Menu'
//         />
//         {/* Overlay to close menu when clicking outside */}
//         {showMenu && (
//           <div
//             className='fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300'
//             onClick={() => setShowMenu(false)}
//           ></div>
//         )}
//         <div
//           ref={menuRef}
//           className={`${showMenu ? 'fixed w-full h-screen translate-x-0' : 'fixed w-full h-screen -translate-x-full'} md:hidden right-0 top-0 z-20 overflow-y-auto bg-white transition-transform duration-300 ease-in-out shadow-lg`}
//         >
//           <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50'>
//             <img className='w-24 h-auto' src={assets.logo} alt='Logo' />
//             <img
//               className='w-8 h-8 cursor-pointer transition-transform duration-200 hover:scale-110'
//               onClick={() => setShowMenu(false)}
//               src={assets.cross_icon}
//               alt='Close'
//             />
//           </div>
//           <ul className='flex flex-col items-center gap-6 mt-8 px-6 text-lg font-semibold text-gray-800'>
//             <NavLink
//               onClick={() => setShowMenu(false)}
//               to='/'
//               className={({ isActive }) => (isActive ? 'text-amber-500' : '')}
//             >
//               <p className='px-6 py-3 rounded-lg  hover:bg-gray-200 transition-colors w-full text-center'>
//                 HOME
//               </p>
//             </NavLink>
//             <NavLink
//               onClick={() => setShowMenu(false)}
//               to='/tripplanner'
//               className={({ isActive }) => (isActive ? 'text-amber-500' : '')}
//             >
//               <p className='px-6 py-3 rounded-lg  hover:bg-gray-200 transition-colors w-full text-center'>
//                 Trip Planner
//               </p>
//             </NavLink>
//             <NavLink
//               onClick={() => setShowMenu(false)}
//               to='/trips'
//               className={({ isActive }) => (isActive ? 'text-amber-500' : '')}
//             >
//               <p className='px-6 py-3 rounded-lg  hover:bg-gray-200 transition-colors w-full text-center'>
//                 Trips
//               </p>
//             </NavLink>
//             <NavLink
//               onClick={() => setShowMenu(false)}
//               to='/blogs'
//               className={({ isActive }) => (isActive ? 'text-amber-500' : '')}
//             >
//               <p className='px-6 py-3 rounded-lg  hover:bg-gray-200 transition-colors w-full text-center'>
//                 Blogs
//               </p>
//             </NavLink>
//             {token && (
//               <div className='flex items-center justify-center w-full px-6 mt-6'>
//                 <button
//                   onClick={() => {
//                     setToken(false);
//                     setShowMenu(false);
//                   }}
//                   className='bg-amber-500 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-600 transition-colors w-full text-center text-lg'
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//             {!token && (
//               <button
//                 onClick={() => {
//                   navigate('../Login');
//                   setShowMenu(false);
//                 }}
//                 className='bg-amber-500 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-600 transition-colors w-full mt-6 text-center text-lg'
//               >
//                 Sign In
//               </button>
//             )}
//           </ul>
//         </div>
//         {token ? (
//           <div className='hidden md:flex items-center gap-2 cursor-pointer group relative'>
//             <div className='bg-gray-300 py-3 px-5 rounded-full'>
//               <p>A</p>
//             </div>
//             <img className='w-4 h-4' src={assets.dropdown_icon} alt='' />
//             <div className='absolute top-12 right-0 pt-2 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
//               <div className='min-w-[180px] bg-white rounded-lg shadow-lg flex flex-col gap-2 p-4 border border-gray-100'>
//                 <p onClick={() => setToken(false)} className='hover:text-amber-500 cursor-pointer transition-colors'>
//                   Logout
//                 </p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <button
//             onClick={() => navigate('../Login')}
//             className='bg-amber-500 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-600 transition-colors hidden md:block'
//           >
//             Sign In
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(null); // null by default
  const menuRef = useRef(null);

  // ✅ اقرأ التوكن من localStorage عند تحميل الكومبوننت
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // ✅ logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    navigate('/login');
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (showMenu && event.key === 'Escape') {
        setShowMenu(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showMenu]);

  return (
    <div className='flex items-center justify-between text-sm py-4 px-6 mb-5 border-b border-gray-200 bg-gray-50 shadow-md'>
      <NavLink to='/' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
        <h2 className='text-3xl text-amber-500 font-bold'>GoGuidaAi</h2>
      </NavLink>

      {/* Desktop Links */}
      <ul className='hidden md:flex items-center gap-6 font-medium text-gray-700'>
        <NavLink to='/' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
          <li className='py-2 text-xs md:text-lg hover:text-amber-500 transition-colors'>Home</li>
        </NavLink>
        <NavLink to='/tripplanner' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
          <li className='py-2 text-xs md:text-lg hover:text-amber-500 transition-colors'>Trip Planner</li>
        </NavLink>
        <NavLink to='/trips' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
          <li className='py-2 text-xs md:text-lg hover:text-amber-500 transition-colors'>Trips</li>
        </NavLink>
        <NavLink to='/blogs' className={({ isActive }) => isActive ? 'text-amber-500' : ''}>
          <li className='py-2 text-xs md:text-lg hover:text-amber-500 transition-colors'>Blogs</li>
        </NavLink>
      </ul>

      {/* Right side buttons */}
      <div className='flex items-center gap-4'>
        {/* Burger menu */}
        <img
          onClick={() => setShowMenu(!showMenu)}
          className='w-6 h-6 md:hidden cursor-pointer transition-transform duration-200 hover:scale-110'
          src={assets.menu_icon}
          alt='Menu'
        />

        {/* Mobile Menu */}
        {showMenu && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300'
            onClick={() => setShowMenu(false)}
          ></div>
        )}
        <div
          ref={menuRef}
          className={`${showMenu ? 'fixed w-full h-screen translate-x-0' : 'fixed w-full h-screen -translate-x-full'} md:hidden right-0 top-0 z-20 overflow-y-auto bg-white transition-transform duration-300 ease-in-out shadow-lg`}
        >
          <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50'>
            <img className='w-24 h-auto' src={assets.logo} alt='Logo' />
            <img
              className='w-8 h-8 cursor-pointer transition-transform duration-200 hover:scale-110'
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt='Close'
            />
          </div>

          <ul className='flex flex-col items-center gap-6 mt-8 px-6 text-lg font-semibold text-gray-800'>
            <NavLink onClick={() => setShowMenu(false)} to='/' className={({ isActive }) => (isActive ? 'text-amber-500' : '')}>
              <p className='px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors w-full text-center'>HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/tripplanner' className={({ isActive }) => (isActive ? 'text-amber-500' : '')}>
              <p className='px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors w-full text-center'>Trip Planner</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/trips' className={({ isActive }) => (isActive ? 'text-amber-500' : '')}>
              <p className='px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors w-full text-center'>Trips</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/blogs' className={({ isActive }) => (isActive ? 'text-amber-500' : '')}>
              <p className='px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors w-full text-center'>Blogs</p>
            </NavLink>

            {token ? (
              <button
                onClick={() => {
                  handleLogout();
                  setShowMenu(false);
                }}
                className='bg-amber-500 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-600 transition-colors w-full mt-6 text-center text-lg'
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setShowMenu(false);
                }}
                className='bg-amber-500 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-600 transition-colors w-full mt-6 text-center text-lg'
              >
                Sign In
              </button>
            )}
          </ul>
        </div>

        {/* Desktop Sign In / Profile */}
        {token ? (
          <div className='hidden md:flex items-center gap-2 cursor-pointer group relative'>
            <div className='bg-gray-300 py-3 px-5 rounded-full'>
              <p>A</p>
            </div>
            <img className='w-4 h-4' src={assets.dropdown_icon} alt='' />
            <div className='absolute top-12 right-0 pt-2 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
              <div className='min-w-[180px] bg-white rounded-lg shadow-lg flex flex-col gap-2 p-4 border border-gray-100'>
                <p
                  onClick={handleLogout}
                  className='hover:text-amber-500 cursor-pointer transition-colors'
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className='bg-amber-500 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-600 transition-colors hidden md:block'
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
