import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hrCredintial: {
    role: "hr",
    email: "ahmed123@gmail.com",
    password: "123",
  },
  jobPost: {
    company: "Dragons",
    description: "Senior Front End Developer",
    experience_level: "entry",
    job_type: "full-time",
    location: "Banah",
    max_salary: "6000",
    min_salary: "1000",
    requirements: ["bachelor's degree in computer science"],
    skills_required: ["react"],
    title: "Senior Front End",
    date: new Date().toISOString().slice(0, 10),
  },
};

const hrSlice = createSlice({
  name: "hr",
  initialState,
  reducers: {
    createHR(state, action) {
      state.hrCredintial = action.payload;
    },
    createPost(state, action) {
      const {
        company,
        experience_level,
        description,
        job_type,
        location,
        title,
        max_salary,
        min_salary,
      } = action.payload;
      state.jobPost = {
        title,
        company,
        location,
        job_type,
        experience_level,
        min_salary,
        max_salary,
        description,
      };
    },
    addRequirements(state, action) {
      if (state.jobPost.requirements.includes(action.payload)) return;
      state.jobPost.requirements.push(action.payload);
    },
    removeRequirements(state, action) {
      state.jobPost.requirements = state.jobPost.requirements.filter(
        (requirement) => requirement !== action.payload
      );
    },
    addSkills(state, action) {
      if (state.jobPost.skills_required.includes(action.payload)) return;
      state.jobPost.skills_required.push(action.payload);
    },
    removeSkills(state, action) {
      state.jobPost.skills_required = state.jobPost.skills_required.filter(
        (skill) => skill !== action.payload
      );
    },
  },
});
export const {
  createHR,
  createPost,
  addRequirements,
  removeRequirements,
  addSkills,
  removeSkills,
} = hrSlice.actions;
export default hrSlice.reducer;
