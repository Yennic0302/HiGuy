import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { videoCall: any; incomingVideoCall: any } = {
  videoCall: undefined,
  incomingVideoCall: undefined,
};
const videoCallSlice = createSlice({
  name: "videoCall",
  initialState: initialState,
  reducers: {
    setVideoCall: (state, action: PayloadAction<any>) => {
      state.videoCall = action.payload;
    },
    setIncomingVideoCall: (state, action: PayloadAction<any>) => {
      state.incomingVideoCall = action.payload;
    },
    endVideoCall: (state) => {
      state.incomingVideoCall = undefined;
      state.videoCall = undefined;
    },
  },
});

export default videoCallSlice.reducer;
export const { setVideoCall, setIncomingVideoCall, endVideoCall } =
  videoCallSlice.actions;
