import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
    data: {
        posts: [],
        post: {},
    },
    user: {
        authenticated: false,
        credentials: {
            userName: "Nicolas",
            userImage:
                "https://firebasestorage.googleapis.com/v0/b/social-app-react-hook.appspot.com/o/58682760797.png?alt=media&token=6b03e49f-9321-4c87-a6a4-24ba8ee52dae",
        },
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
