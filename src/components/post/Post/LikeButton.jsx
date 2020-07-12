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

        await firebase.firestore.collection("likes").add({
            postId,
            userName,
        });

        await postRef.update({ likeCount: likeCount + 1 });
    };

    const handleUnlike = async (postId) => {
        const postRef = firebase.firestore.collection("posts").doc(postId);

        const likeDocument = await firebase.firestore
            .collection("likes")
            .where("userName", "==", userName)
            .where("postId", "==", postId)
            .limit(1)
            .get();

        await firebase.firestore.collection("likes").doc(`${likeDocument.docs[0].id}`).delete();

        await postRef.update({ likeCount: likeCount - 1 });
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
