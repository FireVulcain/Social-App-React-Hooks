import React, { useEffect, useContext } from "react";
import { withFirebase } from "../../config/Firebase/context";

//context
import { GlobalContext } from "../../context/GlobalState";

const Posts = ({ firebase }) => {
    const { state, setPosts } = useContext(GlobalContext);
    const { firestore } = firebase;

    useEffect(() => {
        const getPosts = async () => {
            const result = await firestore.collection("posts").get();

            result.forEach((post) => {
                setPosts(post.data());
            });
        };

        getPosts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(state);
    return <div></div>;
};

export default withFirebase(Posts);
