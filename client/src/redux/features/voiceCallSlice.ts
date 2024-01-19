import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: {
  voiceCall: any;
  incomingVoiceCall: any;
} = {
  voiceCall: undefined,
  incomingVoiceCall: undefined,
};

const voiceCallSlice = createSlice({
  name: "videoCall",
  initialState: initialState,
  reducers: {
    setVoiceCall: (state, action: PayloadAction<any>) => {
      state.voiceCall = action.payload;
    },
    setIncomingVoiceCall: (state, action: PayloadAction<any>) => {
      state.incomingVoiceCall = action.payload;
    },
    endVoiceCall: (state) => {
      state.incomingVoiceCall = undefined;
      state.voiceCall = undefined;
    },
  },
});

export default voiceCallSlice.reducer;
export const { setVoiceCall, setIncomingVoiceCall, endVoiceCall } =
  voiceCallSlice.actions;
