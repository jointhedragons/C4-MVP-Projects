/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-constant-condition */
import { useState } from "react";
import {
  Briefcase,
  Users,
  Eye,
  Star,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";

function HRDashboard() {
  const [selectedJob, setSelectedJob] = useState("");

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">100</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">11</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">0 </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jobs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Job Postings
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* # of jobs */}
            {[0,2][0] === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No jobs posted yet
              </p>
            ) : (
              // jobs.map((job) => (
              <div
                key={"1"} // job.id
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedJob === "1" // job.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  // job.id
                  setSelectedJob(selectedJob === "1" ? null : "1")
                }
              >
                <div className="flex justify-between items-start mb-2">
                  {/* job.title */}
                  <h3 className="font-semibold text-gray-900">Frontend</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      // job.status
                      "active" === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {/* job status */}
                    acitve
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {/* job location */}
                    Germany
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {/* # of applications */}3 applications
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {/* date of posted job */}
                    Posted 10/10/2004
                  </div>
                </div>
              </div>
              // ))
            )}
          </div>
        </div>

        {/* Applications */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Applications {selectedJob ? "(Filtered)" : ""}
            </h2>
            {selectedJob && (
              <button
                onClick={() => setSelectedJob(null)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Show All
              </button>
            )}
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* # of filtered applications */}
            {0 === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No applications yet
              </p>
            ) : (
              // filteredApplications.map((application) => (
              <div
                // application.id
                key={"1"}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {/* talent name */}
                      {"karim" || "Anonymous"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {/* application.job.title */}
                      frontend
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* matching score */}
                    {1 && (
                      <div
                        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium `}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {/* application.matchScore */}
                        {23}%
                      </div>
                    )}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium`}
                    >
                      {/* application.status */}
                      {"pending"}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <p>
                    <strong>Location:</strong> {/* talent location */}
                    {"Benha" || "Not specified"}
                  </p>
                  <p>
                    <strong>Experience:</strong> {/* talent exp */}
                    {"entry level" || "Not specified"}
                  </p>
                  <p>
                    <strong>Applied:</strong> {/* application date */}
                    {10 / 10 / 2004}
                  </p>
                </div>

                {/* talent skills */}
                {["HTML, CSS, React"] && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {["HTML, CSS, React"].slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {["HTML, CSS, React"].length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{["HTML, CSS, React"] - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* application status */}
                {/* {"pending" === "pending" && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        updateApplicationStatus("1", "reviewed")
                      }
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() =>
                        updateApplicationStatus(application.id, "accepted")
                      }
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        updateApplicationStatus(application.id, "rejected")
                      }
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )} */}
              </div>
              // ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
