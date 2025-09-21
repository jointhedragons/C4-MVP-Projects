import { Briefcase, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router";
<<<<<<< HEAD
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { setRole } from "../features/global/global";

function Signin() {
  const { email, role, password } = useSelector(
    (state) => state.talent.talentCredintial
  );
  const {
    email: hrEmail,
    role: hrRole,
    password: hrPassword,
  } = useSelector((state) => state.hr.hrCredintial);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  function onSumbit(data) {
    if (email === data.email && password === data.password) {
      dispatch(setRole(role));
      navigate("/talent-dashboard");
      setError(false);
    } else {
      setError(true);
    }
    if (hrEmail === data.email && hrPassword === data.password) {
      dispatch(setRole(hrRole));
      navigate("/hr-dashboard");
      setError(false);
    } else {
      setError(true);
    }
  }
=======
import { useForm } from "react-hook-form";

function Signin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Submit handler
  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    console.log("Form submitted:", data);

    // simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard"); // redirect example
    }, 1500);
  };

>>>>>>> 9b5974ba68351205b1867a5394a542c14c17d193
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your TalentMatch AI account
          </p>
        </div>

<<<<<<< HEAD
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSumbit)}>
=======
        {/* use handleSubmit from react-hook-form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
>>>>>>> 9b5974ba68351205b1867a5394a542c14c17d193
          <div className="space-y-4">
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
                  type="email"
<<<<<<< HEAD
                  {...register("email", {
                    required: true,
                    validate: (value) => {
                      const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                      return re.test(value) || "Invalid email address";
                    },
                  })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
                  autoComplete="email"
>>>>>>> 9b5974ba68351205b1867a5394a542c14c17d193
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
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
                  type="password"
<<<<<<< HEAD
                  {...register("password", {
                    required: true,
                  })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
=======
                  autoComplete="current-password"
>>>>>>> 9b5974ba68351205b1867a5394a542c14c17d193
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          {error && (
            <div className="space-y-4 bg-red-300 border-1 border-red-500 rounded-md px-4 py-6">
              <p className="text-sm text-red-600 text-center">
                Please check that you entered a correct data
              </p>
            </div>
          )}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              Sign in
            </button>
          </div>

          <div className="text-center flex justify-center gap-1.5 text-blue-600 hover:text-blue-500 text-sm font-medium">
            <p> Don't have an account? </p>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
