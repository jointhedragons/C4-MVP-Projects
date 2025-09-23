import { useAuth } from "../contexts/AuthContext";

import LoginMessage from "../components/LoginMessage";
import { FaBookOpen } from "react-icons/fa";

function CoursesPage() {
  const { isAuth, user } = useAuth();

  console.log(user);

  if (!isAuth) return <LoginMessage />;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-12">My Courses</h1>

      <div className="flex flex-col items-center justify-center text-center">
        <FaBookOpen className="w-16 h-16 text-gray-400 mb-4" />

        <h2 className="text-lg font-semibold text-gray-800">
          No courses enrolled yet
        </h2>

        <p className="text-gray-600 mt-1">
          Start learning by enrolling in courses from the home page.
        </p>
      </div>
    </div>
  );
}

export default CoursesPage;
