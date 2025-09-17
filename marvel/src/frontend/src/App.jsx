import { BrowserRouter, Route, Routes } from "react-router";
import queryClient from "./context/QueryContext";
import AppLayout from "./pages/AppLayout";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import HRDashboard from "./pages/HRDashboard";
import TalentDashboard from "./pages/TalentDashboard";
import Profile from "./pages/Profile";
import SearchJob from "./pages/SearchJob";

import PostJob from "./pages/PostJob";
import NotFound from "./pages/NotFound";

import { QueryClientProvider } from "@tanstack/react-query";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<AppLayout />}>
            <Route path="hr-dashboard" element={<HRDashboard />} />
            <Route path="talent-dashboard" element={<TalentDashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="search-job" element={<SearchJob />} />
            <Route path="post-job" element={<PostJob />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
