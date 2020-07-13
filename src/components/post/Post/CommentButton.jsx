import React, { useState } from "react";

/* Material UI */
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";

/* Import for modal comment */

//context
import { withFirebase } from "./../../../config/Firebase/context";

//Mui stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import { Avatar, Box } from "@material-ui/core";

const CommentButton = ({ firebase, commentCount, postId, userName, userImage }) => {
    const [open, setOpen] = useState(false);
    const [replyText, setreplyText] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setreplyText("");
        setOpen(false);
    };

    const handleComment = async () => {
        const postRef = firebase.firestore.collection("posts").doc(postId);

        await firebase.firestore.collection("comments").doc().set({
            body: replyText,
            createdAt: new Date().toISOString(),
            postId,
            userName,
            userImage,
            postImg: [],
        });

        await postRef.update({ commentCount: commentCount + 1 });

        handleClose();
    };

    return (
        <>
            <div className="comment-button-container" onClick={handleOpen}>
                <IconButton aria-label="like" size="small">
                    <ChatBubbleOutlineRoundedIcon />
                </IconButton>
                {commentCount > 0 ? (
                    <Typography variant="body1" component="span">
                        {commentCount}
                    </Typography>
                ) : null}
            </div>
            <Dialog open={open} onClick={(e) => e.stopPropagation()} onClose={handleClose} className="add-reply dialogbox" fullWidth={true}>
                <DialogContent>
                    <Box display="flex" alignItems="center">
                        <Avatar alt={userName} src={userImage} className="avatar" />
                        <TextField
                            type="text"
                            placeholder="Post your reply"
                            onChange={(e) => setreplyText(e.target.value)}
                            value={replyText}
                            multiline
                            className="text-field"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button className="submit-button" disabled={!replyText && true} onClick={handleComment}>
                        Répondre
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withFirebase(CommentButton);
