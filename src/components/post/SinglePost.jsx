import React, { useContext, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import dayjs from "dayjs";

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

//routes
import * as ROUTES from "./../../constants/routes";
import { CircularProgress } from "@material-ui/core";

const SinglePost = ({ firebase, postId, history }) => {
    const { state, setPost } = useContext(GlobalContext);
    const {
        data: {
            post: { likeCount, commentCount, postImg, createdAt, userName, displayedName, body, userImage },
        },
    } = state;

    useEffect(() => {
        const result = firebase.firestore
            .collection("posts")
            .doc(postId)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.exists) {
                    return history.push(ROUTES.HOME);
                }
                setPost(querySnapshot.data());
            });

        return () => {
            result();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            {Object.entries(state.data.post).length !== 0 ? (
                <>
                    <Box width={1} className="post-info post-single" key={postId}>
                        <PostMenuAction postUsername={userName} postId={postId} />
                        <Box className="user-info" display="flex" alignItems="center">
                            <Link to={`/user/${userName}`}>
                                <Avatar alt={userName} src={userImage} className="avatar" />
                            </Link>
                            <Link to={`/user/${userName}`}>
                                <Typography variant="h6" component="span" className="post-displayed-name">
                                    {displayedName}
                                </Typography>
                                <Typography variant="body2" component="span" className="post-username">
                                    @{userName}
                                </Typography>
                            </Link>
                        </Box>
                        <Box width={1} mt={2}>
                            <Box>
                                <PostBody body={body} postImg={postImg} />
                            </Box>
                            <Box>
                                <Typography variant="body2" component="p" className="post-date">
                                    {dayjs(createdAt).format("H:mm A")} · {dayjs(createdAt).format("MMMM DD, YYYY")}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" className="post-actions">
                                <CommentButton
                                    displayedName={displayedName}
                                    commentCount={commentCount}
                                    postId={postId}
                                    userName={userName}
                                    userImage={userImage}
                                />
                                <LikeButton postId={postId} userName={userName} likeCount={likeCount} />
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <DisplayReply postId={postId} />
                    </Box>
                </>
            ) : (
                <Box width={1} display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            )}
        </>
    );
};

export default withRouter(withFirebase(SinglePost));
