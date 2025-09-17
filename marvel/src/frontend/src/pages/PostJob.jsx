import React, { useState } from "react";
import { MapPin, DollarSign, Plus, X, Briefcase } from "lucide-react";

function PostJob() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    experience_level: "mid",
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: [],
    skills_required: [],
  });
  const [newRequirement, setNewRequirement] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    setFormData({
      title: "",
      company: "",
      location: "",
      type: "full-time",
      experience_level: "mid",
      salary_min: "",
      salary_max: "",
      description: "",
      requirements: [],
      skills_required: [],
    });

    setTimeout(() => setMessage(""), 3000);
  };

  const addRequirement = () => {
    if (
      newRequirement.trim() &&
      !formData.requirements.includes(newRequirement.trim())
    ) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()],
      });
      setNewRequirement("");
    }
  };

  const removeRequirement = (requirement) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((req) => req !== requirement),
    });
  };

  const addSkill = () => {
    if (
      newSkill.trim() &&
      !formData.skills_required.includes(newSkill.trim())
    ) {
      setFormData({
        ...formData,
        skills_required: [...formData.skills_required, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      skills_required: formData.skills_required.filter((s) => s !== skill),
    });
  };

  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "requirement") addRequirement();
      else addSkill();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          </div>
          <p className="text-gray-600">
            Find the perfect talent for your organization
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("Error")
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Company name"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, State or Remote"
                />
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={formData.experience_level}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    experience_level: e.target.value,
                  })
                }
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (3-5 years)</option>
                <option value="senior">Senior Level (6-10 years)</option>
                <option value="executive">Executive Level (10+ years)</option>
              </select>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_min: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="50000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_max: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="80000"
                />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={6}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requirements
            </label>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "requirement")}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a requirement (e.g., Bachelor's degree in Computer Science)"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{requirement}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(requirement)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "skill")}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a required skill (e.g., JavaScript, Project Management)"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills_required.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  company: "",
                  location: "",
                  type: "full-time",
                  experience_level: "mid",
                  salary_min: "",
                  salary_max: "",
                  description: "",
                  requirements: [],
                  skills_required: [],
                });
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? "Posting Job..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
