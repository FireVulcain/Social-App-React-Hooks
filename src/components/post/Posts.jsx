import React, { useEffect, useContext } from "react";
import dayjs from "dayjs";
import * as locale from "dayjs/locale/fr";
import relativeTime from "dayjs/plugin/relativeTime";

//context
import { withFirebase } from "../../config/Firebase/context";
import { GlobalContext } from "../../config/GlobalState/GlobalState";

/* Material UI */
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const Posts = ({ firebase }) => {
    const { state, setPosts } = useContext(GlobalContext);
    const { firestore } = firebase;

    dayjs.extend(relativeTime).locale(locale);

    useEffect(() => {
        const getPosts = async () => {
            const result = await firestore.collection("posts").orderBy("createdAt", "desc").get();
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
                    <Box width={1} display="flex" alignItems="flex-start" className="post-info" key={post.id}>
                        <Box mr={2} className="user-info">
                            <Avatar alt={post.userName} src={post.userImage} className="avatar" />
                        </Box>
                        <Box width={1}>
                            <Box display="flex" alignItems="center">
                                <Typography variant="h6" component="p" className="post-username">
                                    {post.userName}
                                </Typography>
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

export default withFirebase(Posts);
