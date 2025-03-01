import { configureStore } from "@reduxjs/toolkit";
import photoReducer from "./photoSlice";

export const store = configureStore({
    reducer: {
        photos: photoReducer, // Add the photo slice to the store
    },
});