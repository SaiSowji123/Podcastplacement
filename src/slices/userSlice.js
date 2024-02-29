import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice of Redux store
const initialState = {
    user: null, // Holds user data, initialized as null
};

// Creating a slice for managing user-related state in Redux store
const userSlice = createSlice({
    name: "user", // Name of the slice
    initialState, // Initial state defined above
    reducers: {
        // Reducer function to set user data in the state
        setUser: (state, action) => {
            state.user = action.payload; // Update user data with payload data
        },
        // Reducer function to clear user data from the state
        clearUser: (state) => {
            state.user = null; // Reset user data to null
        },
    },
});

// Exporting action creators and reducer from the slice
export const { setUser, clearUser } = userSlice.actions; // Exporting setUser and clearUser action creators
export default userSlice.reducer; // Exporting reducer function

