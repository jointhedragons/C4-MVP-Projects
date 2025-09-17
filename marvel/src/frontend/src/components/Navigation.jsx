import React from "react";
import { User, Briefcase, LogOut, Home, Search, Plus } from "lucide-react";

export const Navigation = ({ currentPage, setCurrentPage }) => {
  //   const handleSignOut = async () => {
  //     try {
  //       await signOut();
  //     } catch (error) {
  //       console.error("Error signing out:", error);
  //     }
  //   };

  const userRole = "hr";    

  const navItems =
    userRole === "hr"
      ? [
          { id: "dashboard", label: "Dashboard", icon: Home },
          { id: "post-job", label: "Post Job", icon: Plus },
          { id: "profile", label: "Profile", icon: User },
        ]
      : [
          { id: "dashboard", label: "Dashboard", icon: Home },
          { id: "search-jobs", label: "Search Jobs", icon: Search },
          { id: "applications", label: "My Applications", icon: Briefcase },
          { id: "profile", label: "Profile", icon: User },
        ];

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
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === item.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}

            <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {userRole}
                </span>
              </div>
              <button
                // onClick={handleSignOut}
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
