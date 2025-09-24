import { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const CoursesContext = createContext();

const initialState = {
  courses: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "fetch_start":
      return { ...state, loading: true, error: null };
    case "fetch_success":
      return { ...state, loading: false, courses: action.payload };
    case "fetch_error":
      return { ...state, loading: false, error: action.payload };
    case "add_course":
      return { ...state, courses: [...state.courses, action.payload] };
    default:
      throw new Error("Unknown action.");
  }
}

function CoursesProvider({ children }) {
  const [{ courses, loading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Fetch courses from Supabase
  async function fetchCourses() {
    dispatch({ type: "fetch_start" });
    const { data, error } = await supabase.from("courses").select("*");

    if (error) {
      dispatch({ type: "fetch_error", payload: error.message });
    } else {
      dispatch({ type: "fetch_success", payload: data });
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ courses, loading, error, fetchCourses }}>
      {children}
    </CoursesContext.Provider>
  );
}

function useCourses() {
  return useContext(CoursesContext);
}

export { CoursesProvider, useCourses };
