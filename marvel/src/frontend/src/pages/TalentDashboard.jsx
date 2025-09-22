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
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { recommendJobs } from "../services";

const TalentDashboard = () => {
  const jobPost = useSelector((state) => state.hr.jobPost);
  const talentProfile = useSelector((state) => state.talent.telentProfile);

  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(null);

  const handleRecommendations = async () => {
    if (jobRecommendations.length) return;

    setLoadingRecommendations(true);
    const response = await recommendJobs(jobPost, talentProfile);

    try {
      setJobRecommendations(response);
      setLoadingRecommendations(false);
    } catch (err) {
      console.log(err);
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

  useEffect(() => {
    handleRecommendations(jobPost, talentProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobPost, talentProfile]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white h-40">
        <h1 className="text-3xl font-bold mb-2">
          {/* profile name */}
          Welcome back <span className="text-blue-300">{name}</span>
        </h1>
        <p className="text-blue-100">
          Track your applications and discover new opportunities
        </p>
      </div>

      <div className="mt-8 shadow-md">
        {/* Recommended Jobs */}
        <div className="bg-white p-6 col-span-2">
          <h2 className="text-xl text-center font-bold text-gray-900 mb-4">
            Recommended For You
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="text-center py-8">
              {!jobRecommendations.length &&
              !loadingRecommendations &&
              loadingRecommendations !== null ? (
                <p className="text-gray-500 text-center py-8">
                  Complete your profile to get better job matches
                </p>
              ) : loadingRecommendations ? (
                <p className="text-gray-500 text-center py-8">
                  Generating Recommendations...
                </p>
              ) : (
                jobRecommendations.map((job, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {job.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Company: {job.company}
                        </p>
                      </div>
                      <div
                        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(
                          job.score
                        )}`}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {job.score}% Match
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatSalary(job.min_salary, job.max_salary)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {job.skills_required.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {skill} ✓
                        </span>
                      ))}
                      {job.skills_required.slice(0, 2).map((skill, index) => (
                        <span
                          key={`missing-${index}`}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm text-gray-500">
                      Posted {job.date}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;
