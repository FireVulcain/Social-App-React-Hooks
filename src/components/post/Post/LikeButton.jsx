import React, { useEffect, useContext } from "react";

//context
import { withFirebase } from "../../../config/Firebase/context";
import { GlobalContext } from "../../../config/GlobalState/GlobalState";

/* Material UI */
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import LikedPost from "@material-ui/icons/Favorite";
import NotLikedPost from "@material-ui/icons/FavoriteBorder";

const LikeButton = ({ firebase, postId, userName, likeCount }) => {
    const { state, setLikes } = useContext(GlobalContext);

    const {
        user: { likes },
    } = state;

    useEffect(() => {
        const getLikes = async () => {
            const result = await firebase.firestore.collection("likes").get();

            const likes = [];
            result.forEach((doc) => {
                likes.push(doc.data());
            });
            setLikes(likes);
        };

        getLikes();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [likeCount]);

    const likedPost = () => {
        if (likes && likes.find((like) => like.postId === postId && like.userName === userName)) {
            return true;
        } else {
            return false;
        }
    };

    const handleLike = async (postId) => {
        const postRef = firebase.firestore.collection("posts").doc(postId);

        const getPost = await postRef.get();
        const getPostUserName = getPost.data().userName;

        const querySnapshot = await firebase.firestore.collection("likes").add({
            postId,
            userName,
        });

        const likeId = querySnapshot.id;

        await postRef.update({ likeCount: firebase.FieldValue.increment(1) });

        if (userName !== getPostUserName) {
            await firebase.firestore.collection("notifications").doc(likeId).set({
                createdAt: new Date().toISOString(),
                postId,
                read: false,
                recipient: getPostUserName,
                sender: userName,
                type: "like",
            });
        }
    };

    const handleUnlike = async (postId) => {
        const postRef = firebase.firestore.collection("posts").doc(postId);

        const getPost = await postRef.get();
        const getPostUserName = getPost.data().userName;

        const likeDocument = await firebase.firestore
            .collection("likes")
            .where("userName", "==", userName)
            .where("postId", "==", postId)
            .limit(1)
            .get();
        const likeId = likeDocument.docs[0].id;

        await firebase.firestore.collection("likes").doc(`${likeId}`).delete();

        await postRef.update({ likeCount: firebase.FieldValue.increment(-1) });

        if (userName !== getPostUserName) {
            await firebase.firestore.collection("notifications").doc(likeId).delete();
        }
    };

    return (
        <>
            {likedPost() ? (
                <div className="like-button-container liked-post" onClick={() => handleUnlike(postId)}>
                    <IconButton aria-label="like" size="small">
                        <LikedPost />
                    </IconButton>
                    {likeCount > 0 ? (
                        <Typography variant="body2" component="span" className="like-count">
                            {likeCount}
                        </Typography>
                    ) : null}
                </div>
            ) : (
                <div className="like-button-container" onClick={() => handleLike(postId)}>
                    <IconButton aria-label="like" size="small">
                        <NotLikedPost />
                    </IconButton>
                    {likeCount > 0 ? (
                        <Typography variant="body2" component="span" className="like-count">
                            {likeCount}
                        </Typography>
                    ) : null}
                </div>
            )}
        </>
    );
};

export default withFirebase(LikeButton);
