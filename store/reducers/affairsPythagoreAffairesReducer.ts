import {GdpAffairsPythagoreAffairesModel} from "../../models/GestionDeProjets/GdpAffairsPythagoreAffairesModel";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppState} from "../store";

export type AffairsPythagoreAffairesState = {
    items: Partial<GdpAffairsPythagoreAffairesModel>[];
}

const initialState: AffairsPythagoreAffairesState = {
    items: [],
}

const affairsPythagoreAffairesSlice = createSlice({
    name: 'affairsPythagoreAffaires',
    initialState: initialState,
    reducers: {
        setAffairsPythagoreAffaires: (state, action: PayloadAction<Partial<GdpAffairsPythagoreAffairesModel>[]>) => {
            state.items = action.payload
        },
    }
});
export const { setAffairsPythagoreAffaires } = affairsPythagoreAffairesSlice.actions;
export const selectAffairsPythagoreAffaires = (state: AppState) => state.affairsPythagoreAffaires.items;

export default affairsPythagoreAffairesSlice.reducer;