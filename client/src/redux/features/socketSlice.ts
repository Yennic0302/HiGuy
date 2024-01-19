import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-extraneous-dependencies

const initialState: { socket: any } = {
  socket: undefined,
};
export const userSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<any>) => {
      if (state.socket === undefined) {
        state.socket = action.payload;
      }
    },
  },
});

export const { setSocket } = userSlice.actions;
export default userSlice.reducer;
