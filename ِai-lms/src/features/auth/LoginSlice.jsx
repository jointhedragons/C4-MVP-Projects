import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

function LoginSlice() {
  const [searchParams] = useSearchParams();

  console.log(searchParams);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log(data);

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
          <button className="bg-[#FFFFFF] w-[50%] rounded-xl">Login</button>
          <button className="w-[50%] rounded-xl">Sign up</button>
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
              errors.email ? "focus:ring-red-600" : "focus:ring-[#35AFA0]"
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
              errors.password ? "focus:ring-red-600" : "focus:ring-[#35AFA0]"
            } transition-all duration-300 shadow-sm`}
            placeholder="••••••••"
          />
          {errors.password && (
            <span className="text-xs font-bold w-max px-2 py-1 text-red-600 bg-red-100 rounded-md ">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* {error && (
          <div className="mx-auto flex w-max items-start gap-3 bg-red-50 text-red-800 px-3 py-2 rounded-lg shadow-md animate-fade-in">
            <svg
              className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-4a.75.75 0 00-.75.75v3.5a.75.75 0 001.5 0v-3.5A.75.75 0 0010 6zm0 7a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )} */}

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
          className={`bg-[#155DFC] text-white font-semibold py-2 rounded-md hover:bg-[#155DFC] transition-colors duration-300 `}
        >
          Login
        </button>
      </form>
    </section>
  );
}

export default LoginSlice;
