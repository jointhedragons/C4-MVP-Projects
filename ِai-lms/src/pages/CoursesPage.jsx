import { useAuth } from "../contexts/AuthContext";

import LoginMessage from "../components/LoginMessage";

function CoursesPage() {
  const { isAuth, user } = useAuth();

  console.log(user);

  if (!isAuth) return <LoginMessage />;
  return <div></div>;
}

export default CoursesPage;
