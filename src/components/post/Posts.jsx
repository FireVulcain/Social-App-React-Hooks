import React, { useEffect, useContext, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//context
import { withFirebase } from "../../config/Firebase/context";
import { GlobalContext } from "../../config/GlobalState/GlobalState";

//Components
import DeletePost from "./DeletePost";

/* Material UI */
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//Icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Posts = ({ firebase, history }) => {
    const { state, setPosts } = useContext(GlobalContext);
    const { firestore } = firebase;

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

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

    const handleClick = (event, postId) => {
        setOpen(postId);
        setAnchorEl(event.target);
    };

    const handleClose = () => {
        setOpen(null);
        setAnchorEl(false);
    };

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
                        // onClick={() => history.push(`user/post/${post.id}`)}
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
                                    {dayjs(post.createdAt).fromNow(true)}
                                </Typography>
                                <IconButton onClick={(e) => handleClick(e, post.id)} className="post-toggle-menu">
                                    <ExpandMoreIcon />
                                </IconButton>
                                <Menu className="menu-toggled" anchorEl={anchorEl} open={open === post.id} onClose={handleClose}>
                                    {state.user.authenticated && post.userName === state.user.credentials.userName ? (
                                        <MenuItem className="menu-item menu-item-delete">
                                            <DeletePost postId={post.id} />
                                        </MenuItem>
                                    ) : null}
                                </Menu>
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
