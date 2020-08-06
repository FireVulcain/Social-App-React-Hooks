import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//context
import { withFirebase } from "../../config/Firebase/context";
import { GlobalContext } from "../../config/GlobalState/GlobalState";

//Components
import CommentButton from "./Post/CommentButton";
import LikeButton from "./Post/LikeButton";
import { PostBody } from "./Post/PostBody";
import { PostMenuAction } from "./Post/PostMenuAction";
import { UserAvatar } from "./Post/UserAvatar";

// Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const Posts = ({ firebase, singleUserPosts }) => {
    const { state, setPosts } = useContext(GlobalContext);
    const { firestore } = firebase;

    const {
        data: { posts },
        user: {
            credentials: { userName, userImage, displayedName },
        },
    } = state;

    dayjs.extend(relativeTime);

    useEffect(() => {
        if (singleUserPosts) {
            const result = firestore
                .collection("posts")
                .where("userName", "==", singleUserPosts)
                .orderBy("createdAt", "desc")
                .onSnapshot((querySnapshot) => {
                    const posts = [];
                    querySnapshot.forEach((doc) => {
                        let post = doc.data();
                        post.id = doc.id;
                        posts.push(post);
                    });
                    setPosts(posts);
                });
            return () => {
                setPosts([]);
                result();
            };
        } else if (userName) {
            let listPostToDisplay = [userName];
            let result;

            const getPosts = async () => {
                const followingRef = await firestore.collection("following").doc(userName).get();
                if (followingRef.exists) {
                    listPostToDisplay = [...listPostToDisplay, ...followingRef.data().listFollowing];
                }

                result = firestore
                    .collection("posts")
                    .where("userName", "in", listPostToDisplay)
                    .orderBy("createdAt", "desc")
                    .onSnapshot((querySnapshot) => {
                        const posts = [];
                        querySnapshot.forEach((doc) => {
                            let post = doc.data();
                            post.id = doc.id;
                            posts.push(post);
                        });
                        setPosts(posts);
                    });
            };

            getPosts();

            return () => {
                setPosts([]);
                if (typeof result === "function") {
                    result();
                }
            };
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [singleUserPosts, userName]);
    return (
        <>
            {posts.map((post) => {
                return (
                    <Box width={1} display="flex" alignItems="flex-start" className="post-info" key={post.id}>
                        <UserAvatar userImage={post.userImage} userName={post.userName} />
                        <Box width={1}>
                            <Box display="flex" alignItems="baseline">
                                <Link to={`/user/${post.userName}`} className="post-user-link">
                                    <Typography variant="h6" component="span" className="post-displayed-name">
                                        {post.displayedName}
                                    </Typography>
                                    <Typography variant="body2" component="span" className="post-username">
                                        @{post.userName} <span className="spacer"> · </span>
                                    </Typography>
                                </Link>
                                <Typography variant="body2" component="p" className="post-date">
                                    {dayjs(post.createdAt).fromNow(true)}
                                </Typography>
                                <PostMenuAction postUsername={post.userName} postId={post.id} />
                            </Box>
                            <PostBody body={post.body} postImg={post.postImg} gif={post.gif} />
                            <Box display="flex" alignItems="center" className="post-actions">
                                <CommentButton
                                    displayedName={displayedName}
                                    commentCount={post.commentCount}
                                    postId={post.id}
                                    userName={userName}
                                    userImage={userImage}
                                />
                                <LikeButton postId={post.id} userName={userName} likeCount={post.likeCount} />
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </>
    );
};

export default withFirebase(Posts);
