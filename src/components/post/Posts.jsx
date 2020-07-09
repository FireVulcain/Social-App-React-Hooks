import React, { useEffect, useContext } from "react";
import { Link, withRouter } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//context
import { withFirebase } from "../../config/Firebase/context";
import { GlobalContext } from "../../config/GlobalState/GlobalState";

/* Material UI */
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const Posts = ({ firebase, history }) => {
    const { state, setPosts } = useContext(GlobalContext);
    const { firestore } = firebase;

    dayjs.extend(relativeTime);

    useEffect(() => {
        const getPosts = async () => {
            const posts = [];

            const result = await firestore.collection("posts").orderBy("createdAt", "desc").get();

            result.forEach((doc) => {
                let post = doc.data();
                post.id = doc.id;
                posts.push(post);
            });

            setPosts(posts);
        };

        getPosts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {state.data.posts.map((post) => {
                return (
                    <Box
                        width={1}
                        display="flex"
                        alignItems="flex-start"
                        className="post-info"
                        key={post.id}
                        onClick={() => history.push(`user/post/${post.id}`)}
                    >
                        <Box mr={2} className="user-info">
                            <Link to={`user/${post.userName}`} onClick={(e) => e.stopPropagation()}>
                                <Avatar alt={post.userName} src={post.userImage} className="avatar" />
                            </Link>
                        </Box>
                        <Box width={1}>
                            <Box display="flex" alignItems="center">
                                <Link to={`user/${post.userName}`} onClick={(e) => e.stopPropagation()}>
                                    <Typography variant="h6" component="p" className="post-username">
                                        {post.userName}
                                    </Typography>
                                </Link>
                                <Typography variant="body2" component="p" className="post-date">
                                    {dayjs(post.createdAt).fromNow()}
                                </Typography>
                            </Box>

                            <Typography variant="body1">{post.body}</Typography>
                        </Box>
                    </Box>
                );
            })}
        </>
    );
};

export default withRouter(withFirebase(Posts));
