import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Post {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    createdAt: string;
}

interface PhotoState {
    posts: Post[];
    loading: boolean;
    error: string | null;
    recentPhoto: string | null;
}

const initialState: PhotoState = {
    posts: [],
    loading: false,
    error: null,
    recentPhoto: null,
};

const photoSlice = createSlice({
    name: "photos",
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<Post>) => {
            state.posts.push(action.payload);
        },
        createFacebookAd: (state, action: PayloadAction<string>) => {
            const postId = action.payload;
            console.log(`Creating Facebook ad for post: ${postId}`);
        },
        enhanceWithAI: (state, action: PayloadAction<string>) => {
            const postId = action.payload;
            console.log(`Enhancing post with AI: ${postId}`);
        },
        setRecentPhoto: (state, action: PayloadAction<string | null>) => {
            state.recentPhoto = action.payload;
        },
        deletePost: (state, action: PayloadAction<string>) => {
            state.posts = state.posts.filter(post => post.id !== action.payload);
        },
    },
});

export const { addPost, createFacebookAd, enhanceWithAI, setRecentPhoto, deletePost } = photoSlice.actions;
export default photoSlice.reducer;