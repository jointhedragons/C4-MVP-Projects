
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [state, setState] = useState("Login"); // or "Login"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "http://localhost:4000/api/auth"; // backend URL

  // ✅ لو المستخدم بالفعل مسجل دخول → رجعه Home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = state === "Sign up" ? "/register" : "/login";
      const body =
        state === "Sign up"
          ? { name, email, password }
          : { email, password };

      const { data } = await axios.post(`${API_URL}${endpoint}`, body, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // ✅ Save token + user info
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert(`${state} successful!`);
      navigate("/"); // 👈 رجوع على Home
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Something went wrong");
      } else {
        setError("Server not responding");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col gap-4 m-auto items-start p-6 sm:p-8 min-w-[340px] sm:min-w-96 border border-gray-300 rounded-xl text-gray-700 text-sm bg-white shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-500">
          Please {state === "Sign up" ? "Sign Up" : "log in"} to create a trip
        </p>

        {error && <p className="text-red-500">{error}</p>}

        {state === "Sign up" && (
          <div className="w-full pt-2">
            <p className="font-medium">Full Name</p>
            <input
              className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your full name"
            />
          </div>
        )}

        <div className="w-full">
          <p className="font-medium">Email</p>
          <input
            className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
          />
        </div>

        <div className="w-full">
          <p className="font-medium">Password</p>
          <input
            className="border border-gray-300 rounded-md w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 text-white w-full h-10 rounded-md text-base font-medium hover:bg-amber-600 transition-colors shadow-md"
        >
          {loading
            ? "Loading..."
            : state === "Sign up"
            ? "Create Account"
            : "Login"}
        </button>

        <p
          className="text-gray-500 hover:text-amber-500 cursor-pointer transition-colors"
          onClick={() => setState(state === "Sign up" ? "Login" : "Sign up")}
        >
          {state === "Sign up"
            ? "Already have an account? Login here"
            : "Create a new account? Click here"}
        </p>
      </div>
    </form>
  );
};

export default Login;
