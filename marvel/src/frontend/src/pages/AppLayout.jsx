import { Outlet } from "react-router";
import { Navigation } from "../components/Navigation";
import { useState } from "react";

function AppLayout() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  return (
    <main className="">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Outlet />
    </main>
  );
}

export default AppLayout;
