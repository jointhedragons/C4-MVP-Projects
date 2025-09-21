import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  talentCredintial: {
    role: "talent",
    email: "ahmed@gmail.com",
    password: "123",
  },
  telentProfile: {
    bio: "Front-end developer skilled in React, JavaScript, and modern UI design, seeking opportunities to build responsive, user-friendly web apps.",
    experience: "senior",
    location: "Benha",
    name: "John Doe",
    phone: "123456789012",
    position: "Front-End",
    salary: "500",
    skills: ["react"],
  },
};

const talentSlice = createSlice({
  name: "talent",
  initialState,
  reducers: {
    createAccount(state, action) {
      state.talentCredintial = action.payload;
    },
    createProfile(state, action) {
      const { bio, experience, location, name, phone, postion, salary } =
        action.payload;
      state.telentProfile = {
        bio,
        experience,
        location,
        name,
        phone,
        postion,
        salary,
      };
    },
    addSkills(state, action) {
      if (state.telentProfile.skills.includes(action.payload)) return;
      state.telentProfile.skills.push(action.payload);
    },
    removeSkills(state, action) {
      state.telentProfile.skills = state.telentProfile.skills.filter(
        (skill) => skill !== action.payload
      );
    },
  },
});
export const { createAccount, createProfile, addSkills, removeSkills } =
  talentSlice.actions;
export default talentSlice.reducer;
