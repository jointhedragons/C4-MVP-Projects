import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./AppLayout";
import HomePage from "./pages/HomePage";
import LoginSlice from "./features/auth/LoginSlice";
import SignupSlice from "./features/auth/SignupSlice";
import { AuthProvider } from "./contexts/AuthContext";

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
