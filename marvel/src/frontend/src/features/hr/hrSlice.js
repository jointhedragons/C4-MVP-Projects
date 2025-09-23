import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hrCredintial: {
    role: "hr",
    email: "ahmed123@gmail.com",
    password: "123",
  },
  jobPost: JSON.parse(localStorage.getItem("job_post")) || [],
};

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    createHR(state, action) {
      state.hrCredintial = action.payload;
    },
    createPost(state, action) {
      state.jobPost.push(action.payload);
      localStorage.setItem("job_post", JSON.stringify(state.jobPost));
    },
    updatePost: {
      prepare(id, postData) {
        return {
          payload: { id, postData },
        };
      },
      reducer(state, action) {
        const index = state.jobPost.findIndex(
          (post) => post.id === action.payload.id
        );
        state.jobPost[index] = action.payload.postData;
      },
    },
    removePost(state, action) {
      state.jobPost = state.jobPost.filter(
        (post) => post.id !== action.payload
      );
      localStorage.setItem("job_post", JSON.stringify(state.jobPost));
    },
  },
});
export const { createHR, createPost, removePost, updatePost } = hrSlice.actions;
export default hrSlice.reducer;
