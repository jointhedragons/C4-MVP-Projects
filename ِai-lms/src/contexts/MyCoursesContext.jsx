import { createContext, useContext, useReducer } from "react";
import { supabase } from "../lib/supabaseClient";

const MyCoursesContext = createContext();

const initialState = {
  myCourses: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "fetch_start":
      return { ...state, loading: true, error: null };
    case "fetch_success":
      return { ...state, loading: false, myCourses: action.payload };
    case "fetch_error":
      return { ...state, loading: false, error: action.payload };
    case "add_my_course":
      return { ...state, myCourses: [...state.myCourses, action.payload] };
    default:
      throw new Error("Unknown action.");
  }
}

function MyCoursesProvider({ children }) {
  const [{ myCourses, loading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Fetch my courses for a specific user
  async function fetchMyCourses(userId) {
    console.log(userId);
    dispatch({ type: "fetch_start" });
    let { data, error } = await supabase
      .from("users_courses")
      .select("course_id")
      .eq("user_id", userId);

    if (error) {
      dispatch({ type: "fetch_error", payload: error.message });
    } else {
      console.log(data);
      dispatch({ type: "fetch_success", payload: data });
    }
  }

  return (
    <MyCoursesContext.Provider
      value={{ myCourses, loading, error, fetchMyCourses }}
    >
      {children}
    </MyCoursesContext.Provider>
  );
}

function useMyCourses() {
  return useContext(MyCoursesContext);
}

export { MyCoursesProvider, useMyCourses };
