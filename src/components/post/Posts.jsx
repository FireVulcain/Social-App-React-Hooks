import React, { useEffect, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
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

// Material UI
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const Posts = ({ firebase, history }) => {
    const { state, setPosts } = useContext(GlobalContext);
    const { firestore } = firebase;

    const {
        data: { posts },
        user: {
            credentials: { userName },
        },
    } = state;

    dayjs.extend(relativeTime);

    useEffect(() => {
        const getPosts = async () => {
            const result = await firestore.collection("posts").orderBy("createdAt", "desc");

            result.onSnapshot((querySnapshot) => {
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const redirectToPost = (e, userName, postId) => {
        if (e.target.tagName === "DIV" || e.target.tagName === "P") {
            history.push(`${userName}/post/${postId}`);
        } else {
            return;
        }
    };

    return (
        <>
            {posts.map((post) => {
                return (
                    <Box
                        width={1}
                        display="flex"
                        alignItems="flex-start"
                        className="post-info"
                        key={post.id}
                        onClick={(e) => redirectToPost(e, post.userName, post.id)}
                    >
                        <Box mr={2} className="user-info">
                            <Link to={`user/${post.userName}`}>
                                <Avatar alt={post.userName} src={post.userImage} className="avatar" />
                            </Link>
                        </Box>
                        <Box width={1}>
                            <Box display="flex" alignItems="center">
                                <Link to={`user/${post.userName}`}>
                                    <Typography variant="h6" component="span" className="post-username">
                                        {post.userName}
                                    </Typography>
                                </Link>
                                <Typography variant="body2" component="p" className="post-date">
                                    {dayjs(post.createdAt).fromNow(true)}
                                </Typography>
                                <PostMenuAction postUsername={post.userName} postId={post.id} />
                            </Box>
                            <Box>
                                <PostBody body={post.body} postImg={post.postImg} />
                            </Box>
                            <Box display="flex" alignItems="center" className="post-actions">
                                <CommentButton commentCount={post.commentCount} />
                                <LikeButton postId={post.id} userName={userName} likeCount={post.likeCount} />
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </>
    );
};

export default withRouter(withFirebase(Posts));
