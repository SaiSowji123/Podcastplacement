import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";      // Importing userReducer from userSlice
import podcastReducer from "./slices/podcastSlice"; // Importing podcastReducer from podcastSlice

// Creating and exporting the Redux store
export default configureStore({
    reducer: {
        user: userReducer,        // Assigning userReducer to the 'user' slice of the store
        podcasts: podcastReducer, // Assigning podcastReducer to the 'podcasts' slice of the store
    },
});
