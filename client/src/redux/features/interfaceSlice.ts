/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { InitialStateInterface } from "@/types/auth";
import { createSlice } from "@reduxjs/toolkit";

const initialState: InitialStateInterface = {
  contactsPage: false,
  profilePage: {
    show: false,
    profileId: "",
  },
  searchPage: false,
};
export const userSlice = createSlice({
  name: "interface",
  initialState,
  reducers: {
    setContactsPage: (state) => {
      state.contactsPage = !state.contactsPage;
    },
    setProfile: (state, action) => {
      state.profilePage = action.payload;
    },
    setSearchPage: (state) => {
      state.searchPage = !state.searchPage;
    },
  },
});

export const { setContactsPage, setProfile, setSearchPage } = userSlice.actions;
export default userSlice.reducer;
