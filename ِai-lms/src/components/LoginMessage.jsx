import { NavLink } from "react-router-dom";

function LoginMessage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white shadow-md rounded-2xl p-6 text-center border">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          🚪 Oops! You’re not logged in
        </h2>
        <p className="text-gray-600 mb-4">
          Please log in to continue and access your dashboard.
        </p>
        <NavLink
          to="/loginslice"
          className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          Go to Login
        </NavLink>
      </div>
    </div>
  );
}

export default LoginMessage;
