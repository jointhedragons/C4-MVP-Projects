import { Mail, Lock, UserCheck, Building } from "lucide-react";
import { useNavigate } from "react-router";
import FormHeader from "../UI/FormHeader";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { createAccount } from "../features/talent/talentSlice";
import { createHR } from "../features/hr/hrSlice";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  function onSubmit(data) {
    if (!userRole) return;
    if (userRole === "talent") {
      dispatch(
        createAccount({
          email: data.email.trim(),
          password: data.password.trim(),
          role: userRole,
        })
      );
    } else {
      dispatch(
        createHR({
          email: data.email.trim(),
          password: data.password.trim(),
          role: userRole,
        })
      );
    }
    navigate("/");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <FormHeader />
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setUserRole("talent")}
                  className={`flex items-center justify-center p-4 border-2 cursor-pointer rounded-lg transition-all ${
                    userRole === "talent"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  Talent
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole("hr")}
                  className={`flex items-center justify-center p-4 border-2 cursor-pointer rounded-lg transition-all ${
                    userRole === "hr"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Building className="h-5 w-5 mr-2" />
                  HR / Recruiter
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.email && "border-red-500 focus:ring-red-500"
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    validate: (value) => {
                      const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                      return re.test(value) || "Invalid email address";
                    },
                  })}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.password && "border-red-500 focus:ring-red-500"
                  }`}
                  placeholder="Create a password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) => {
                      const password = getValues("password");
                      return value === password || "Passwords do not match";
                    },
                  })}
                  className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.confirmPassword &&
                    "border-red-500 focus:ring-red-500"
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="space-y-4 bg-red-300 border-1 border-red-500 rounded-md px-4 py-6">
              <p className="text-sm text-red-600 text-center">
                Please check that you entered a correct data
              </p>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4
              cursor-pointer 
              border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? "Loading..." : "Sign up"}
            </button>
          </div>

          <div className="text-center flex justify-center gap-1.5 text-blue-600 hover:text-blue-500 text-sm font-medium">
            <p> Don't have an account? </p>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => navigate("/signin")}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
