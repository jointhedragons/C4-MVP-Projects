import { useAuth } from "../contexts/AuthContext";
import LoginMessage from "../components/LoginMessage";

function ProfilePage() {
  const { isAuth, user } = useAuth();

  console.log(user);

  if (!isAuth) return <LoginMessage />;

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <div className="bg-white shadow-lg rounded-2xl p-6 border">
        {/* Avatar Circle */}
        <div className="uppercase w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white text-xl font-bold mx-auto">
          {user.name
            .split(" ")
            .map((word) => word[0])
            .join("")}
        </div>

        {/* Name & Email */}
        <div className="text-center mt-4 mb-4">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-gray-500 flex items-center justify-center gap-2 text-sm">
            {user.email}
          </p>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Enrolled Courses</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Completed Courses</span>
            <span className="font-medium">1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Hours</span>
            <span className="font-medium">45h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Completion Rate</span>
            <span className="font-medium">0%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
