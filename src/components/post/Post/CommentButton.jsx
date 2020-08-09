import React, { useState } from "react";

/* Material UI */
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

//context
import { withFirebase } from "./../../../config/Firebase/context";

//Mui stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import SvgIcon from "@material-ui/core/SvgIcon";

const CommentButton = ({ firebase, commentCount, postId, userName, userImage, displayedName }) => {
    const [open, setOpen] = useState(false);
    const [replyText, setreplyText] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setreplyText("");
        setOpen(false);
    };

    const handleComment = async () => {
        setUploadLoading(true);
        const postRef = firebase.firestore.collection("posts").doc(postId);

        const getPost = await postRef.get();
        const getPostUserName = getPost.data().userName;

        const querySnapshot = await firebase.firestore.collection("comments").add({
            body: replyText,
            createdAt: new Date().toISOString(),
            postId,
            userName,
            userImage,
            displayedName,
            postImg: [],
        });

        const commentId = querySnapshot.id;

        await postRef.update({ commentCount: firebase.FieldValue.increment(1) });

        if (userName !== getPostUserName) {
            await firebase.firestore.collection("notifications").doc(commentId).set({
                createdAt: new Date().toISOString(),
                postId,
                read: false,
                recipient: getPostUserName,
                sender: userName,
                type: "comment",
            });
        }
        setUploadLoading(false);
        handleClose();
    };

    return (
        <>
            <div className="comment-button-container" onClick={handleOpen}>
                <IconButton aria-label="like" size="small">
                    <SvgIcon>
                        <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                    </SvgIcon>
                </IconButton>
                {commentCount > 0 ? (
                    <Typography variant="body1" component="span">
                        {commentCount}
                    </Typography>
                ) : null}
            </div>
            <Dialog open={open} onClose={handleClose} className={`add-reply dialogbox ${uploadLoading ? "uploading-reply" : ""}`} fullWidth={true}>
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
                    {!uploadLoading ? (
                        <Button className="submit-button" disabled={!replyText && true} onClick={handleComment}>
                            Reply
                        </Button>
                    ) : null}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withFirebase(CommentButton);
