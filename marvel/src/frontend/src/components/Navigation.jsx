import { User, Briefcase, LogOut, Home, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router";

export const Navigation = () => {
  const role = useSelector((state) => state.global.role);
  const name = useSelector((state) => {
    if (role === "talent") {
      return state.talent.telentProfile.name.split(" ").at(0);
    } else {
      return "hr";
    }
  });

  const navigate = useNavigate();
  const navItems =
    role === "hr"
      ? [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            route: "/hr-dashboard",
          },
          { id: "post-job", label: "Post Job", icon: Plus, route: "/post-job" },
        ]
      : [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            route: "/talent-dashboard",
          },
          { id: "profile", label: "Profile", icon: User, route: "/profile" },
        ];

  const handleLogOut = () => {
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg border-b mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                TalentMatch AI
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.route}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </NavLink>
              );
            })}

            <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {name}
                </span>
              </div>
              <button
                onClick={() => handleLogOut()}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
