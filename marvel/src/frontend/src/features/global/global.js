import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: { role: localStorage.getItem("role") || "" },
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
  },
});

export default globalSlice.reducer;
export const { setRole } = globalSlice.actions;
