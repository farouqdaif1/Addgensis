import { createSlice } from "@reduxjs/toolkit";
interface PhotoState {
    photos: string[]; // Array to store photo URIs
}

const initialState: PhotoState = {
    photos: [], // Array to store photo URIs
};

const photoSlice = createSlice({
    name: "photos",
    initialState,
    reducers: {
        addPhoto: (state, action) => {
            state.photos.push(action.payload); // Add a new photo URI to the array
        },
    },
});

export const { addPhoto } = photoSlice.actions;
export default photoSlice.reducer;