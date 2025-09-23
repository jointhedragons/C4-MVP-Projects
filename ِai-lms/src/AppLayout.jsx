import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";

function AppLayout() {
  const { isAuth, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="h-screen  bg-[#EFF9FB]">
      {/* Navbar */}
      <nav className="navbar">
        <NavLink to="/" className="logo">
          LearnAI
        </NavLink>

        <ul className="nav-links">
          <NavLink to="/" className="flex justify-center items-center gap-2">
            <FaHome className="text-xl" /> Home
          </NavLink>

          <NavLink
            to="/mycourses"
            className="flex justify-center items-center gap-2"
          >
            <FaBookOpen className="text-xl" /> My Courses
          </NavLink>

          <NavLink
            to="profile"
            className="flex justify-center items-center gap-2"
          >
            <CgProfile className="text-xl" /> Profile
          </NavLink>

          {isAuth ? (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className={`border px-2 py-1 rounded-md`}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/loginslice");
              }}
              className={`border px-2 py-1 rounded-md`}
            >
              Login
            </button>
          )}
        </ul>
      </nav>

      <main className="mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
