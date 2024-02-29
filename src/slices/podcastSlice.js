import { createSlice } from "@reduxjs/toolkit";

// Initial state for the podcast slice of Redux store
const initialState = {
    podcasts: [], // Array to hold podcast data
};

// Creating a slice for managing podcast-related state in Redux store
const podcastSlice = createSlice({
    name: "podcasts", // Name of the slice
    initialState, // Initial state defined above
    reducers: {
        // Reducer function to set podcasts data in the state
        setPodcasts: (state, action) => {
            state.podcasts = action.payload; // Update podcasts array with payload data
        },
    },
});

// Exporting action creators and reducer from the slice
export const { setPodcasts } = podcastSlice.actions; // Exporting setPodcasts action creator
export default podcastSlice.reducer; // Exporting reducer function

