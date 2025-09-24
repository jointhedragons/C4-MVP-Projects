import { useAuth } from "../contexts/AuthContext";

import LoginMessage from "../components/LoginMessage";
import { FaBookOpen } from "react-icons/fa";
import { useEffect } from "react";
import { useMyCourses } from "../contexts/MyCoursesContext";

function CoursesPage() {
  const { isAuth, user } = useAuth();

  const { myCourses, loading, fetchMyCourses } = useMyCourses();

  useEffect(() => {
    console.log(user.id);
    if (user) {
      fetchMyCourses(user.id);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  if (!isAuth) return <LoginMessage />;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-12">My Courses</h1>

      <section className="courses">
        {myCourses ? (
          myCourses.map((course) => (
            <div className="card" key={course.id}>
              <div className="level">{course.level}</div>
              <img src={course.image} alt={course.title} />
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p>
                <b>By:</b> {course.instructor_name}
              </p>
              <p>
                <b>Duration:</b> {course.duration}
              </p>
              {course.enrolled ? (
                <button className="enrolled">Enrolled</button>
              ) : (
                <button className="enroll">Enroll Now</button>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <FaBookOpen className="w-16 h-16 text-gray-400 mb-4" />

            <h2 className="text-lg font-semibold text-gray-800">
              No courses enrolled yet
            </h2>

            <p className="text-gray-600 mt-1">
              Start learning by enrolling in courses from the home page.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default CoursesPage;
