import {createSlice} from "@reduxjs/toolkit"
import { Advert } from "../../Model/Advert";

const defaultObject:Advert = {category:"default",name:"default",price:0}
const initialState: {mainProperty:Advert} = {
    mainProperty:defaultObject
}

const propertyesSlice = createSlice({
    initialState:initialState,
    name: "propertyesSlice",
    reducers: {
        set: (state, data) => {
            state.mainProperty = data.payload;
        },

        reset: (state) => {
            state.mainProperty = defaultObject;
        }
    }
})

export const propertyesAction = propertyesSlice.actions;
export const propertyesReducer = propertyesSlice.reducer;

