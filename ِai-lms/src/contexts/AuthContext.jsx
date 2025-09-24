import { supabase } from "../lib/supabaseClient";
import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuth: JSON.parse(localStorage.getItem("isAuth")) || false,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuth: true,
      };
    case "logout":
      return {
        ...state,
        user: null,
        isAuth: false,
      };
    default:
      throw new Error("Unknown action.");
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuth }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isAuth", JSON.stringify(isAuth));
  }, [user, isAuth]);

  async function login(email, password) {
    let { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password);

    if (error) {
      return error;
    }
    if (users && users.length > 0) {
      dispatch({ type: "login", payload: users[0] });
      return true;
    } else {
      return false;
    }
  }

  async function signup({ name, email, password }) {
    // Check if email already exists
    const { data: exists, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (checkError) {
      return { success: false, message: "Error checking email" };
    }
    if (exists && exists.length > 0) {
      return { success: false, message: "Email already registered" };
    }

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([{ name: name, email: email, password: password }])
      .select();

    if (error) {
      return { success: false, message: "Signup failed" };
    }

    // Auto login after signup
    if (data && data.length > 0) {
      dispatch({ type: "login", payload: data[0] });
      return { success: true, user: data[0] };
    }

    return { success: false, message: "Signup failed" };
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider value={{ user, isAuth, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
