import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import AppLayout from "./AppLayout";
import HomePage from "./pages/HomePage";
import LoginSlice from "./features/auth/LoginSlice";
import SignupSlice from "./features/auth/SignupSlice";
import ProfilePage from "./pages/ProfilePage";
import CoursesPage from "./pages/CoursesPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "loginslice",
        element: <LoginSlice />,
      },
      {
        path: "signupslice",
        element: <SignupSlice />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "mycourses",
        element: <CoursesPage />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>;
    </AuthProvider>
  );
}

export default App;
