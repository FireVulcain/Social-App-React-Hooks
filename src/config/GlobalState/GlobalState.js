import React, { createContext, useReducer, useEffect } from "react";
import AppReducer from "./AppReducer";
import { withFirebase } from "../Firebase/context";

const initialState = {
    data: {
        posts: [],
        post: {},
    },
    user: {
        authenticated: false,
        credentials: {},
        likes: [],
        loading: true,
    },
    ui: {
        loading: false,
        errors: null,
    },
};

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
const GlobalProvider = ({ firebase, children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    useEffect(() => {
        firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                const getUser = async (userId) => {
                    const result = await firebase.firestore.collection("users").where("userId", "==", userId).get();
                    result.forEach((user) => {
                        dispatch({
                            type: "SET_USER",
                            payload: user.data(),
                        });
                    });
                };
                getUser(user.uid);
            } else {
                dispatch({
                    type: "LOGOUT_USER",
                });
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setPosts = (posts) => {
        dispatch({
            type: "SET_POSTS",
            payload: posts,
        });
    };

    return <GlobalContext.Provider value={{ state, setPosts }}>{children}</GlobalContext.Provider>;
};

export default withFirebase(GlobalProvider);