import React from "react";
import "./HomePage.css";

const HomePage = () => {
  const courses = [
    {
      id: 1,
      title: "Introduction to Programming",
      level: "Beginner",
      description: "Learn the fundamentals of programming with Python. Perfect for beginners who want to start their coding journey.",
      instructor: "Dr. Sarah Johnson",
      duration: "8 weeks",
      image: "https://m.media-amazon.com/images/I/61ffpJ2LQPL._AC_UF1000,1000_QL80_.jpg",
      enrolled: true,
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      level: "Intermediate",
      description: "Explore the world of data science, analytics, and machine learning. Learn to extract insights from complex datasets.",
      instructor: "Prof. Michael Chen",
      duration: "12 weeks",
      image: "https://miro.medium.com/v2/resize:fit:1358/1*vLuW1zvVf7pVnU32xG0fJQ.png",
      enrolled: false,
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      level: "Beginner to Advanced",
      description: "Master modern web development with HTML, CSS, JavaScript, and React. Build beautiful, responsive websites.",
      instructor: "Alex Rodriguez",
      duration: "16 weeks",
      image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*RjkN5p6rk6RKQYIA9QZwWw.jpeg",
      enrolled: false,
    },
    {
      id: 4,
      title: "AI and Machine Learning",
      level: "Advanced",
      description: "Dive deep into artificial intelligence and machine learning algorithms. Build intelligent systems.",
      instructor: "Dr. Emily Watson",
      duration: "14 weeks",
      image: "https://builtin.com/sites/www.builtin.com/files/styles/ckeditor_optimize/public/inline-images/ai-vs-machine-learning.png",
      enrolled: false,
    },
  ];

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">LearnAI</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>My Courses</li>
          <li>Profile</li>
          <li>Logout</li>
        </ul>
      </nav>

      {/* Title */}
      <header className="header">
        <h1>Available Courses</h1>
        <p>Discover new skills and advance your career with AI-powered learning</p>
        <button className="add-course">+ Add Course</button>
      </header>

      {/* Courses */}
      <section className="courses">
        {courses.map((course) => (
          <div className="card" key={course.id}>
            <div className="level">{course.level}</div>
            <img src={course.image} alt={course.title} />
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p><b>By:</b> {course.instructor}</p>
            <p><b>Duration:</b> {course.duration}</p>
            {course.enrolled ? (
              <button className="enrolled">Enrolled</button>
            ) : (
              <button className="enroll">Enroll Now</button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
