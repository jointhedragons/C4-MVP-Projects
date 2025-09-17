import { Outlet } from "react-router";

function AppLayout() {
  return (
    <main className="pt-12">
      <Outlet />
    </main>
  );
}

export default AppLayout;
