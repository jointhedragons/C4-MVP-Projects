import {
  Briefcase,
  MapPin,
  DollarSign,
  Star,
  X,
  Sparkles,
  PencilOff,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { recommendTalents } from "../services/index";
import { useState } from "react";
import { removePost } from "../features/hr/hrSlice";
import { useNavigate } from "react-router";

function HRDashboard() {
  const jobPost = useSelector((state) => state.hr.jobPost);
  const talentProfile = useSelector((state) => state.talent.telentProfile);
  const dispatch = useDispatch();
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(null);
  const navigate = useNavigate();
  const handleRecommendations = async () => {
    if (jobRecommendations.length || loadingRecommendations) return;

    setLoadingRecommendations(true);

    try {
      const response = await recommendTalents(jobPost, talentProfile);
      setJobRecommendations(response);
      setLoadingRecommendations(false);
    } catch (err) {
      setLoadingRecommendations(null);
      console.log(err);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

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
              <p className="text-2xl font-bold text-gray-900">
                {jobPost.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols- lg:grid-cols-2 gap-6">
        {/* Jobs */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
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
              jobPost.map((job, i) => (
                <div
                  className="border-1 border-gray-300 rounded-md p-3"
                  key={i}
                >
                  <div className="mb-2 flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <button
                      className="text-red-600 hover:text-red-800 duration-75 cursor-pointer"
                      onClick={() => dispatch(removePost(job.id))}
                    >
                      <X />
                    </button>
                  </div>
                  <div className="mb-2 flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <div>
                        <MapPin className="text-gray-600" size={16} />
                      </div>
                      <p>{job.location}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div>
                        <DollarSign className="text-gray-400" size={16} />
                      </div>
                      <p className="text-sm text-gray-400">
                        ${job.min_salary} - ${job.max_salary}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    {job.skills_required.map((skill, index) => (
                      <span
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        key={index}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">Posted {job.date}</p>
                    <button
                      className="text-blue-600 hover:text-blue-800 duration-75 cursor-pointer"
                      onClick={() => navigate(`/post-job/${job.id}`)}
                    >
                      <PencilOff size={16} />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-800 duration-75 cursor-pointer"
                      onClick={handleRecommendations}
                    >
                      <Sparkles size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-center text-xl font-bold text-gray-900 mb-4">
            Your Ideal Candidats
          </h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {!jobRecommendations.length && !loadingRecommendations && (
              <p className="text-gray-500 text-center py-8">
                Please Click The Generate Button....
              </p>
            )}
            {/* # of filtered applications */}
            {!jobRecommendations.length &&
            !loadingRecommendations &&
            loadingRecommendations !== null ? (
              <p className="text-gray-500 text-center py-8">
                No Relevant Candidates!
              </p>
            ) : loadingRecommendations ? (
              <p className="text-gray-500 text-center py-8">
                Generating Recommendations...
              </p>
            ) : (
              jobRecommendations.map((recommendation, i) => (
                <div
                  // application.id
                  key={i}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {/* talent name */}
                        {recommendation.name || recommendation.Name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* matching score */}
                      {(recommendation.score || recommendation.Score) && (
                        <div
                          className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(
                            recommendation.score
                          )}`}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          {/* application.matchScore */}
                          {recommendation.score || recommendation.Score}%
                        </div>
                      )}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium`}
                      ></span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-3">
                    <p>
                      <strong>Location:</strong> {/* talent location */}
                      {recommendation.location ||
                        recommendation.Location ||
                        "Not specified"}
                    </p>
                    <p>
                      <strong>Experience:</strong> {/* talent exp */}
                      {recommendation.experience ||
                        recommendation.Experience ||
                        "Not specified"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {/* talent exp */}
                      {recommendation.phone ||
                        recommendation.Phone ||
                        "Not specified"}
                    </p>
                    <p>
                      <strong>Position:</strong> {/* talent exp */}
                      {recommendation.position ||
                        recommendation.Position ||
                        "Not specified"}
                    </p>
                    <p>
                      <strong>Salary:</strong> {/* talent exp */}
                      {recommendation.salary ||
                        recommendation.Salary ||
                        "Not specified"}
                    </p>
                    <p>
                      <strong>Reason:</strong> {/* talent exp */}
                      {recommendation.reason ||
                        recommendation.Reason ||
                        "Not specified"}
                    </p>
                  </div>

                  {/* talent skills */}
                  {Array.isArray(recommendation.skills) && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {recommendation.skills
                          .slice(0, 3)
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        {recommendation.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{["HTML, CSS, React"] - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <button
                    className="cursor-pointer bg-red-500 py-0.5 px-2 text-red-100 rounded-2xl text-center text-sm"
                    onClick={() => {
                      setJobRecommendations([]);
                      setLoadingRecommendations(null);
                    }}
                  >
                    Clear
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
