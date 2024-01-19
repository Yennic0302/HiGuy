/* eslint-disable import/extensions */
// eslint-disable-next-line import/no-extraneous-dependencies
import { InitialStateUser, SetProperty } from "@/types/auth";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: InitialStateUser = {
  isLoggedIn: false,
  userData: undefined,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<InitialStateUser>) => {
      state.userData = action.payload.userData;
    },
    setPropertyUserData: (state, action: PayloadAction<SetProperty>) => {
      const data = action.payload;
      state.userData = { ...state.userData, [data.name]: data.value };
    },
  },
});

export const { setUserData, setPropertyUserData } = userSlice.actions;
export default userSlice.reducer;
