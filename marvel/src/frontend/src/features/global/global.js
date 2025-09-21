import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
  name: "global",
  initialState: { role: "hr" },
  reducers: {
    setRole(state, action) {
      state.role = action.payload;
    },
  },
});

export default globalSlice.reducer;
export const { setRole } = globalSlice.actions;
