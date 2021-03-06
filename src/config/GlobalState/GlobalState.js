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
        notifications: [],
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
        let listener;
        firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                const getUser = async (userId) => {
                    const result = await firebase.firestore.collection("users").where("userId", "==", userId).get();
                    result.forEach((user) => {
                        listener = firebase.firestore
                            .collection("notifications")
                            .where("recipient", "==", user.data().userName)
                            .orderBy("createdAt", "desc")
                            .onSnapshot((querySnapshot) => {
                                if (querySnapshot.empty) {
                                    dispatch({
                                        type: "SET_NOTIFICATION",
                                        payload: null,
                                    });
                                } else {
                                    let notifsList = [];
                                    querySnapshot.forEach((notification) => {
                                        let notif = notification.data();
                                        notif.id = notification.id;
                                        notifsList.push(notif);
                                    });
                                    dispatch({
                                        type: "SET_NOTIFICATION",
                                        payload: notifsList,
                                    });
                                }
                            });

                        dispatch({
                            type: "SET_USER",
                            payload: user.data(),
                        });
                    });
                };
                getUser(user.uid);
            } else {
                if (typeof listener === "function") {
                    listener();
                }
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
    const setPost = (post) => {
        dispatch({
            type: "SET_POST",
            payload: post,
        });
    };

    const setLikes = (likes) => {
        dispatch({
            type: "LIKE_POST",
            payload: likes,
        });
    };

    return <GlobalContext.Provider value={{ state, setPosts, setLikes, setPost }}>{children}</GlobalContext.Provider>;
};

export default withFirebase(GlobalProvider);
