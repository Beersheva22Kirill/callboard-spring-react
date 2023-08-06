import {createSlice} from "@reduxjs/toolkit"
import { CodePayload } from "../../Model/Alert/CodePayload";
import CodeType from "../../Model/Alert/CodeType";

const defaultMessage:CodePayload = {code: CodeType.OK, message:""};

const initialState: {codeMessage:CodePayload} = {
    codeMessage:defaultMessage
}

const alertSlice = createSlice({
    initialState:initialState,
    name: "alertSlice",
    reducers: {
        set: (state, data) => {
            state.codeMessage = data.payload;
        },

        reset: (state) => {
            state.codeMessage = defaultMessage;
        }
    }
})

export const alertAction = alertSlice.actions;
export const alertReducer = alertSlice.reducer;

