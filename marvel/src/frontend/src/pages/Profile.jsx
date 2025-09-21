import {
  User,
  MapPin,
  Phone,
  DollarSign,
  Briefcase,
  Plus,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addSkills,
  createProfile,
  removeSkills,
} from "../features/talent/talentSlice";
import { useForm } from "react-hook-form";

function Profile() {
  const { role } = useSelector((state) => state.talent.talentCredintial);
  const profile = useSelector((state) => state.talent.telentProfile);
  const {
    register,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: profile,
  });

  const dispatch = useDispatch();
  function onSubmit(data) {
    dispatch(
      createProfile({
        ...data,
        location: data.location.trim(),
        name: data.name.trim(),
        bio: data.bio.trim(),
        position: data.position.trim(),
      })
    );
  }
  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Complete your profile to get better matches
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 8,
                        message: "Name must be at least 3 characters long",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name must be at most 50 characters long",
                      },
                    })}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                    {...register("phone", {
                      required: "Please Enter Your Phone Number",
                      pattern: {
                        value: /^[0-9]{12}$/,
                        message: "Please Enter Valid Phone Number",
                      },
                    })}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
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
                      required: "Please Enter Your Location",
                    })}
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  {...register("experience", {
                    required: "Please Select Your Experience Level",
                  })}
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6-10 years)</option>
                  <option value="executive">Executive Level (10+ years)</option>
                </select>
              </div>

              {/* Company (for HR) or Current Position (for Talent) */}
              {/* user role */}
              {role === "hr" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your company name"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Position
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your current job title"
                      {...register("position", {
                        required: "Please Enter Your Current Position",
                      })}
                    />
                  </div>
                </div>
              )}

              {/* Salary Expectation (for Talent only) */}
              {/* user role */}
              {role === "talent" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Expectation (Annual)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Expected annual salary"
                      {...register("salary", {
                        required: "Please Enter Your Salary Expectation",
                        min: {
                          value: 0,
                          message: "Salary must be greater than 0",
                        },
                      })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio / About Me
              </label>
              <textarea
                rows={4}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                {...register("bio", {
                  required: "Please Enter Your Bio",
                })}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a skill (e.g., JavaScript, Project Management)"
                  {...register("skills", {
                    required: "Please Enter Your Skills",
                  })}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  onClick={() =>
                    dispatch(addSkills(getValues("skills").trim()))
                  }
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => dispatch(removeSkills(skill))}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
