import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GdpAffairModel } from "../../models/GdPModels";
import { StateType } from "../store";

const initialState: StateType<Partial<GdpAffairModel>> = {
  data: [],
  loading: false
};

const affairSlice = createSlice({
    name: "affairs",
    initialState: initialState,
    reducers: {
      setAffairState: (state, action: PayloadAction<StateType<Partial<GdpAffairModel>>>) => {
        state.data = action.payload.data;
        state.loading = action.payload.loading;
        state.error = action.payload.error;
      },
    }
  })
;

//Reducer
export const { setAffairState } = affairSlice.actions;

const affairReducers = affairSlice.reducer;
export default affairReducers;
