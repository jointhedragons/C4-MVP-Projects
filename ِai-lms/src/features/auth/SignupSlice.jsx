import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function SignupSlice() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { signup } = useAuth();

  const navigate = useNavigate();

  async function onSubmit(data) {
    const result = await signup({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result.success) {
      alert("Signup successful!");
      navigate("/");
    } else {
      alert(result.message || "Signup failed!");
    }

    reset();
  }

  return (
    <section className="min-h-screen flex flex-row justify-evenly items-center w-[64%] mx-auto">
      <div className="text-center">
        <div className="w-[432px] h-[282px] bg-slate-300 rounded-lg"></div>

        <h1 className="text-3xl tracking-wide font-semibold text-[#3E445A] mt-4 mb-1">
          Welcome To Learn AI
        </h1>
        <p className="text-[#4A5578]">Your AI-powered learning companion</p>
      </div>

      <form
        className="flex flex-col gap-6 w-full max-w-md p-6 bg-white rounded-xl shadow-lg text-lg text-[#3E445A]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-center">Get Started</h2>
          <p>Join thousands of learners today</p>
        </div>

        <div className="bg-[#ECECF0] p-1 rounded-xl flex justify-between text-center text-[#3E445A]">
          <NavLink
            to="/loginslice"
            className={({ isActive }) =>
              `w-[50%] rounded-xl ${isActive ? "bg-white" : ""}`
            }
          >
            Login
          </NavLink>

          <NavLink
            to="/signupslice"
            className={({ isActive }) =>
              `w-[50%] rounded-xl ${isActive ? "bg-white" : ""}`
            }
          >
            Sign up
          </NavLink>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className={`text-sm font-medium ${
              errors.email ? "text-red-600" : "text-[#3E445A]"
            }`}
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "This field is required !" })}
            className={`bg-[#F3F9F7] rounded-md px-4 py-2 outline-none focus:ring-2 ${
              errors.name ? "focus:ring-red-600" : "focus:ring-[#00A63E]"
            } transition-all duration-300 shadow-sm`}
            placeholder="Enter your name"
          />
          {errors.email && (
            <span className="text-xs font-bold w-max px-2 py-1 text-red-600 bg-red-100 rounded-md ">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className={`text-sm font-medium ${
              errors.email ? "text-red-600" : "text-[#3E445A]"
            }`}
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "This field is required !" })}
            className={`bg-[#F3F9F7] rounded-md px-4 py-2 outline-none focus:ring-2 ${
              errors.email ? "focus:ring-red-600" : "focus:ring-[#00A63E]"
            } transition-all duration-300 shadow-sm`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-xs font-bold w-max px-2 py-1 text-red-600 bg-red-100 rounded-md ">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className={`text-sm font-medium ${
              errors.password ? "text-red-600" : "text-[#3E445A]"
            }`}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "This field is required !" })}
            className={`bg-[#F3F9F7] rounded-md px-4 py-2 outline-none focus:ring-2 ${
              errors.password ? "focus:ring-red-600" : "focus:ring-[#00A63E]"
            } transition-all duration-300 shadow-sm`}
            placeholder="••••••••"
          />
          {errors.password && (
            <span className="text-xs font-bold w-max px-2 py-1 text-red-600 bg-red-100 rounded-md ">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* <div className="relative h-8">
          <NavLink
            to="/signuppage"
            className={`absolute right-0 text-[#35AFA0] font-semibold px-2 py-1 rounded-md hover:text-white hover:bg-[#35AFA0] transition-all duration-300 w-max ${
              status === "loading" ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            sign up
          </NavLink>
        </div> */}

        <button
          type="submit"
          className={`bg-[#00A63E] text-white font-semibold py-2 rounded-md hover:bg-[#00A63E] transition-colors duration-300 `}
        >
          Sign up
        </button>
      </form>
    </section>
  );
}

export default SignupSlice;
