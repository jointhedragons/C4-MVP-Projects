import { Link, useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <p className="text-6xl font-black text-gray-300">Page Note Found</p>
      <button
        onClick={() => navigate(-1)}
        className="block mt-4 font-semibold text-indigo-500 cursor-pointer"
      >
        GO Back
      </button>
    </div>
  );
}

export default NotFound;
