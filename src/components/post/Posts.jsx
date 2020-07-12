import React, { useEffect, useContext, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//context
import { withFirebase } from "../../config/Firebase/context";
import { GlobalContext } from "../../config/GlobalState/GlobalState";

//Components
import DeletePost from "./Post/DeletePost";
import ModalImage from "react-modal-image";
import LikeButton from "./Post/LikeButton";

/* Material UI */
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//Icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CommentButton from "./Post/CommentButton";

const Posts = ({ firebase, history }) => {
    const { state, setPosts } = useContext(GlobalContext);
    const { firestore } = firebase;

    const {
        data: { posts },
        user: {
            credentials: { userName },
            authenticated,
        },
    } = state;

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
                                <IconButton
                                    onClick={(e) => {
                                        handleClick(e, post.id);
                                    }}
                                    className="post-toggle-menu"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                                <Menu
                                    className="menu-toggled"
                                    anchorEl={anchorEl}
                                    open={open === post.id}
                                    onClose={(e) => {
                                        e.stopPropagation();
                                        handleClose();
                                    }}
                                >
                                    {authenticated && post.userName === userName ? (
                                        <MenuItem className="menu-item menu-item-delete">
                                            <DeletePost postId={post.id} />
                                        </MenuItem>
                                    ) : null}
                                </Menu>
                            </Box>
                            <Box>
                                <Typography variant="body1">{post.body}</Typography>

                                {post.postImg ? (
                                    <div className="post-img-container">
                                        {post.postImg.map((postImg, key) => {
                                            return (
                                                <div className="post-img" key={key} style={{ backgroundImage: `url(${postImg})` }}>
                                                    <ModalImage hideDownload={true} hideZoom={true} small={postImg} large={postImg} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null}
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
