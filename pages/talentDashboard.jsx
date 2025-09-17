/* eslint-disable no-constant-binary-expression */
/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Briefcase,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  DollarSign,
} from "lucide-react";

export const TalentDashboard = () => {
  const [loading, setLoading] = useState(true);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "reviewed":
        return <Search className="h-4 w-4 text-blue-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {/* profile name */}
          Welcome back!
        </h1>
        <p className="text-blue-100">
          Track your applications and discover new opportunities
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
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {/* {stats.totalApplications} */} 3
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {/* {stats.pendingApplications} */} 3
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {/* {stats.reviewedApplications} */} 3
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-gray-900">
                {/* {stats.acceptedApplications} */} 3
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Applications
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {/* # of applications */}
            {0 === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No applications yet
              </p>
            ) : (
              //   applications.slice(0, 5).map((application) => (
              <div
                key={1 /*application.id*/}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      frontend{/*application.job.title*/}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {/* {application.job.company} */} jaffna
                    </p>
                  </div>
                  <span
                    className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      "pending"
                    )}`}
                  >
                    {getStatusIcon("pending")}
                    <span className="ml-1 capitalize">
                      {/* {application.status} */} pending
                    </span>
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-2">
                  Applied{" "}
                  {/* {new Date(application.created_at).toLocaleDateString()} */}
                  10/10
                </div>

                {1 && (
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(
                      100
                    )}`}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {100}% Match
                  </div>
                )}
              </div>
              //   ))
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recommended For You
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {
              /*recommendedJobs.length*/ 0 === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">
                    No recommendations available
                  </p>
                  <p className="text-sm text-gray-400">
                    Complete your profile to get better job matches
                  </p>
                </div>
              ) : (
                //   recommendedJobs.map((jobMatch) => (
                <div
                  key={"1" /*jobMatch.job.id*/}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {/* {jobMatch.job.title} */} frontend
                      </h4>
                      <p className="text-sm text-gray-600">
                        {/* {jobMatch.job.company} */} jaffna
                      </p>
                    </div>
                    <div
                      className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(
                        100
                      )}`}
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {100}% Match
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {/* {jobMatch.job.location} */} banha
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {formatSalary(1, 200)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {["HTML", "CSS", "REACT"]
                      .slice(0, 3)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {skill} ✓
                        </span>
                      ))}
                    {["HTML", "CSS", "REACT"]
                      .slice(0, 2)
                      .map((skill, index) => (
                        <span
                          key={`missing-${index}`}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>

                  <div className="text-sm text-gray-500">
                    Posted{" "}
                    {/* {new Date(jobMatch.job.created_at).toLocaleDateString()} */}
                    10/10/2004
                  </div>
                </div>
                //   ))
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};
