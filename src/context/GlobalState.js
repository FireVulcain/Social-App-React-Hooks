import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
    data: {
        posts: [],
        post: {},
    },
    user: {
        authenticated: false,
        credentials: {},
        likes: [],
    },
    ui: {
        loading: false,
        errors: null,
    },
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    const setPosts = (posts) => {
        dispatch({
            type: "SET_POSTS",
            payload: posts,
        });
    };

    return <GlobalContext.Provider value={{ state, setPosts }}>{children}</GlobalContext.Provider>;
};
