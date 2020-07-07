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
                let posts = post.data();
                posts.id = post.id;
                setPosts(posts);
            });
        };

        getPosts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {state.data.posts.map((post) => {
                return (
                    <div className="post-info" key={post.id}>
                        <div className="user-info">
                            <img src={post.userImage} alt={post.userName} />
                            <p>{post.userName}</p>
                        </div>
                        <p>{post.body}</p>
                    </div>
                );
            })}
        </>
    );
};

export default withFirebase(Posts);
