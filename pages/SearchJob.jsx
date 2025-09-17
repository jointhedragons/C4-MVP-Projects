/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Star,
  ExternalLink,
} from "lucide-react";

function SearchJob() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    experience_level: "",
    min_salary: "",
  });




  



 

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not specified";
    if (min && max)
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    return `Up to $${max?.toLocaleString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Perfect Job
          </h1>
          <p className="text-gray-600">
            Discover opportunities that match your skills and preferences
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search jobs by title, skills, or keywords..."
            />
            <button
              // onClick={fetchJobs}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                Search
              </div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="remote">Remote</option>
              <option value="new york">New York</option>
              <option value="san francisco">San Francisco</option>
              <option value="chicago">Chicago</option>
              <option value="austin">Austin</option>
            </select>
          </div>

          <div>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          <div>
            <select
              value={filters.experience_level}
              onChange={(e) =>
                setFilters({ ...filters, experience_level: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="executive">Executive Level</option>
            </select>
          </div>

          <div>
            <input
              type="number"
              value={filters.min_salary}
              onChange={(e) =>
                setFilters({ ...filters, min_salary: e.target.value })
              }
              placeholder="Min Salary"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          // onClick={fetchJobs}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* jobs.length */}
          {0 === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-gray-500">
                No jobs found matching your criteria.
              </p>
            </div>
          ) : (
            // jobs.map((jobMatch) => (
              <div
                key={"1"} //jobMatch.job.id
                className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {/* {jobMatch.job.title} */} 
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {/* {jobMatch.job.company} */}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {/* {jobMatch.job.location} */}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {/* {jobMatch.job.type} */}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {formatSalary(
                              1,200
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(
                            100
                          )}`}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          {/*jobMatch.match_score*/}% Match
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {/* {jobMatch.job.description} */}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {["react", "html", "css", "redux", "js"] /*jobMatch.job.skills_required*/
                      ?.slice(0, 5)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            ["react", "html", "css", "redux", "js"].includes(skill)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {skill}
                          {["react", "html", "css", "redux", "js"].includes(skill) && " ✓"}
                        </span>
                      ))}
                    {(["react", "html", "css", "redux", "js"].length || 0) > 5 && (
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        +{(["react", "html", "css", "redux", "js"].length || 0) - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Posted{" "}
                    {/* {new Date(jobMatch.job.created_at).toLocaleDateString()} */}
                  </div>
                  <button
                    // onClick={() => handleApply("1")}
                    className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            // ))
          )}
        </div>
      )}
    </div>
  );

}

export default SearchJob;
