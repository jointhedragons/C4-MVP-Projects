import { Outlet, useNavigation } from "react-router-dom";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="h-screen  bg-[#EFF9FB]">
      <main className="mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
