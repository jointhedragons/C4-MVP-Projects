import { MapPin, DollarSign, Plus, X, Briefcase } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../features/hr/hrSlice";
import { useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate, useParams } from "react-router";

function PostJob() {
  let params = useParams();
  const id = params.id;
  const {
    title,
    company,
    date,
    description,
    experience_level,
    job_type,
    location,
    max_salary,
    min_salary,
    skills_required,
    requirements: requiremntsData,
  } = useSelector((state) =>
    id ? state.hr.jobPost.find((post) => post.id === id) : {}
  );

  const { register, handleSubmit, getValues, reset } = useForm({
    defaultValues: {
      title,
      company,
      date,
      description,
      experience_level,
      job_type,
      location,
      max_salary,
      min_salary,
    },
  });
  const [skills, setSkills] = useState(() => (id ? skills_required : []));
  const [requirements, setRequirments] = useState(() =>
    id ? requiremntsData : []
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleAddRequirements(requirement) {
    if (!requirements || requirements.includes(requirement)) return;
    setRequirments([...requirements, requirement]);
  }
  function handleRemoveRequirements(requirement) {
    setRequirments(requirements.filter((req) => req !== requirement));
  }

  function handleAddSkills(skill) {
    if (!skill || skills.includes(skill)) return;
    setSkills([...skills, skill]);
  }
  function handleRemoveSkills(skill) {
    setSkills(skills.filter((sk) => sk !== skill));
  }

  function onSubmit(data) {
    const formatData = {
      id: nanoid(),
      company: data.company.trim(),
      experience_level: data.experience_level.trim(),
      job_type: data.job_type.trim(),
      location: data.location.trim(),
      max_salary: data.max_salary,
      min_salary: data.min_salary,
      description: data.description.trim(),
      requirements: requirements,
      skills_required: skills,
      title: data.title.trim(),
      date: new Date().toLocaleDateString(),
    };
    if (id) {
      dispatch(updatePost(id, formatData));
    } else {
      dispatch(createPost(formatData));
    }
    navigate("/hr-dashboard");
    reset();
    setSkills([]);
    setRequirments([]);
  }

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Senior Software Engineer"
                {...register("title", { required: "Job title is required" })}
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Company name"
                {...register("company", {
                  required: "Company name is required",
                })}
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, State or Remote"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("job_type", {
                  required: "Job type is required",
                })}
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
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register("experience_level", {
                  required: "Experience level is required",
                })}
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="1000"
                  {...register("min_salary", {
                    required: "Minimum salary is required",
                    min: {
                      value: 1000,
                      message: "Minimum salary must be at least $1000",
                    },
                  })}
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="6000"
                  {...register("max_salary", {
                    required: "Maximum salary is required",
                    min: {
                      value: 5000,
                      message: "Maximum salary must be at least $6000",
                    },
                  })}
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
              rows={6}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
              {...register("description")}
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a requirement (e.g., Bachelor's degree in Computer Science)"
                {...register("requirements")}
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                onClick={() => {
                  handleAddRequirements(getValues("requirements").trim());
                  reset({
                    requirements: "",
                  });
                }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{requirement}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirements(requirement)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a required skill (e.g., JavaScript, Project Management)"
                {...register("skills_required")}
              />
              <button
                type="button"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors cursor-pointer"
                onClick={() => {
                  handleAddSkills(getValues("skills_required").trim());
                  reset({
                    skills_required: "",
                  });
                }}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkills(skill)}
                    className="ml-2 text-purple-600 hover:text-purple-800 cursor-pointer"
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
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              onClick={() => {
                reset();
                setSkills([]);
                setRequirments([]);
              }}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              {id ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
