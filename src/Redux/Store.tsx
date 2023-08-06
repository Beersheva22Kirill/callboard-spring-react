import { configureStore } from "@reduxjs/toolkit";
import { alertReducer } from "./Slice/AlertMessageSlice";
import { useSelector } from "react-redux";
import { propertyesReducer } from "./Slice/MainPropertySlice";

export const store = configureStore({
    reducer:{
        alertState:alertReducer,
        propertyesState:propertyesReducer
    }
})

export function useSelectorAlertState() {
    return useSelector<any,any>(state => state.alertState.codeMessage)
}

export function useSelectorMainPropertyes() {
    return useSelector<any,any>(state => state.propertyesState.mainProperty)
}