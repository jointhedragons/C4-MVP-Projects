import { Briefcase, Users, Calendar, MapPin, DollarSign } from "lucide-react";
import { useSelector } from "react-redux";

function HRDashboard() {
  const jobPost = useSelector((state) => state.hr.jobPost);
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">HR Dashboard</h1>
        <p className="text-blue-100">
          Manage your job postings and review talented candidates
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-6 shadow-lg basis-[50%]">
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-0 text-center">
              <p className="text-sm text-gray-600 text-center flex-1">
                Total Jobs
              </p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 col-span-2">
          <h2 className="text-center text-xl font-bold text-gray-900 mb-4">
            Your Job Postings
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* # of jobs */}
            {!jobPost ? (
              <p className="text-gray-500 text-center py-8">
                No jobs posted yet
              </p>
            ) : (
              <div className="border-1 border-gray-300 rounded-md p-3">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{jobPost.title}</h3>
                  <p className="text-sm text-gray-600">hr</p>
                </div>
                <div className="mb-2 flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <div>
                      <MapPin className="text-gray-600" size={16} />
                    </div>
                    <p>{jobPost.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div>
                      <DollarSign className="text-gray-400" size={16} />
                    </div>
                    <p className="text-sm text-gray-400">
                      ${jobPost.min_salary} - ${jobPost.max_salary}
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  {jobPost.skills_required.map((skill, index) => (
                    <span
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      key={index}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Posted {jobPost.date}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
