import React, { useContext, useEffect } from "react";
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
import DisplayReply from "./DisplayReply";

// Material UI
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const SinglePost = ({ firebase, postId }) => {
    const { state, setPost } = useContext(GlobalContext);
    const {
        data: {
            post: { likeCount, commentCount, postImg, createdAt, userName, body, userImage },
        },
    } = state;

    dayjs.extend(relativeTime);

    useEffect(() => {
        const getPost = async () => {
            const result = await firebase.firestore.collection("posts").doc(postId);

            result.onSnapshot((querySnapshot) => {
                setPost(querySnapshot.data());
            });
        };

        getPost();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {state.data.post ? (
                <>
                    <Box width={1} display="flex" alignItems="flex-start" className="post-info" key={postId}>
                        <Box mr={2} className="user-info">
                            <Link to={`user/${userName}`}>
                                <Avatar alt={userName} src={userImage} className="avatar" />
                            </Link>
                        </Box>
                        <Box width={1}>
                            <Box display="flex" alignItems="center">
                                <Link to={`user/${userName}`}>
                                    <Typography variant="h6" component="span" className="post-username">
                                        {userName}
                                    </Typography>
                                </Link>
                                <Typography variant="body2" component="p" className="post-date">
                                    {dayjs(createdAt).fromNow(true)}
                                </Typography>
                                <PostMenuAction postUsername={userName} postId={postId} />
                            </Box>
                            <Box>
                                <PostBody body={body} postImg={postImg} />
                            </Box>
                            <Box display="flex" alignItems="center" className="post-actions">
                                <CommentButton commentCount={commentCount} postId={postId} userName={userName} userImage={userImage} />
                                <LikeButton postId={postId} userName={userName} likeCount={likeCount} />
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <DisplayReply postId={postId} />
                    </Box>
                </>
            ) : null}
        </>
    );
};

export default withFirebase(SinglePost);
