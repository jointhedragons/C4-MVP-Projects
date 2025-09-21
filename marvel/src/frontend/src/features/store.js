import { configureStore } from "@reduxjs/toolkit";
import talentReducer from "./talent/talentSlice";
import hrReducers from "./hr/hrSlice";
import globalReducer from "./global/global";

const store = configureStore({
  reducer: {
    talent: talentReducer,
    hr: hrReducers,
    global: globalReducer,
  },
});

export default store;
