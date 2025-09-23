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
    const res = await fetch(
      `http://localhost:8000/users?email=${email}&password=${password}`
    );
    const users = await res.json();
    if (users.length > 0) {
      dispatch({ type: "login", payload: users[0] });
      return true;
    } else {
      return false;
    }
  }

  async function signup({ name, email, password }) {
    //check emai exist
    const resCheck = await fetch(`http://localhost:8000/users?email=${email}`);
    const exists = await resCheck.json();
    if (exists.length > 0) {
      return { success: false, message: "Email already registered" };
    }
    //Add user
    const res = await fetch("http://localhost:8000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const user = await res.json();
    // Auto login
    dispatch({ type: "login", payload: user });
    return { success: true, user };
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
