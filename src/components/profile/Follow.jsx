import React, { useState, useEffect } from "react";

/* Material UI */
import Button from "@material-ui/core/Button";

export const Follow = ({ loggedUser, userName, firebase }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followingText, setFollowingText] = useState("Following");

    useEffect(() => {
        const getFollowing = async () => {
            const followingRef = await firebase.firestore.collection("following").doc(loggedUser).get();
            if (followingRef.exists) {
                if (followingRef.data().listFollowing.includes(userName)) setIsFollowing(true);
            }
        };

        if (loggedUser && userName) {
            getFollowing();
        }
    }, [loggedUser, userName, firebase.firestore]);

    const followUser = async () => {
        setIsFollowing(true);

        const userFollowDoc = await firebase.firestore.collection("following").doc(loggedUser).get();

        if (userFollowDoc.exists) {
            await firebase.firestore
                .collection("following")
                .doc(loggedUser)
                .update({
                    listFollowing: firebase.FieldValue.arrayUnion(userName),
                });
        } else {
            await firebase.firestore
                .collection("following")
                .doc(loggedUser)
                .set({
                    listFollowing: firebase.FieldValue.arrayUnion(userName),
                });
        }
    };
    const unFollowUser = async () => {
        setIsFollowing(false);
        await firebase.firestore
            .collection("following")
            .doc(loggedUser)
            .update({
                listFollowing: firebase.FieldValue.arrayRemove(userName),
            });
    };

    return (
        <>
            {!isFollowing ? (
                <Button onClick={followUser} variant="contained" className="follow-button">
                    Follow
                </Button>
            ) : (
                <Button
                    onClick={unFollowUser}
                    variant="contained"
                    className="unfollow-button"
                    onMouseEnter={() => setFollowingText("Unfollow")}
                    onMouseLeave={() => setFollowingText("Following")}
                >
                    {followingText}
                </Button>
            )}
        </>
    );
};
