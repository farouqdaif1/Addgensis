import { createSlice } from "@reduxjs/toolkit";

interface Post {
    id: string;
    images: string[];
    caption?: string;
    createdAt: number;
}

interface PhotoState {
    recentPhoto: string | null; // Store the most recent photo taken with camera
    posts: Post[]; // Array to store posts
}

const initialState: PhotoState = {
    recentPhoto: null, // Store the most recent photo taken with camera
    posts: [], // Array to store posts
};

const photoSlice = createSlice({
    name: "photos",
    initialState,
    reducers: {
        setRecentPhoto: (state, action) => {
            state.recentPhoto = action.payload; // Set the most recent photo URI
        },
        createPost: (state, action) => {
            const { images, caption } = action.payload;
            const newPost = {
                id: Date.now().toString(),
                images,
                caption,
                createdAt: Date.now(),
            };
            state.posts.push(newPost);
        },
        deletePost: (state, action) => {
            const postId = action.payload;
            state.posts = state.posts.filter(post => post.id !== postId);
        },
    },
});

export const {
    setRecentPhoto,
    createPost,
    deletePost
} = photoSlice.actions;
export default photoSlice.reducer;