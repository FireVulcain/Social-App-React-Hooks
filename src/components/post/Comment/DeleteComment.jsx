import React, { useState } from "react";

//context
import { withFirebase } from "../../../config/Firebase/context";

//Mui stuff
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

// Icons
import DeleteOutline from "@material-ui/icons/DeleteOutline";

const DeleteComment = ({ firebase, commentId, postId, commentCount }) => {
    const [open, setOpen] = useState(false);
    const { firestore } = firebase;

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deletePost = async () => {
        // Delete comment
        await firestore.collection("comments").doc(commentId).delete();

        // Update comment count on post
        await firestore
            .collection("posts")
            .doc(postId)
            .update({ commentCount: firebase.FieldValue.increment(-1) });
    };
    return (
        <>
            <Button onClick={handleOpen} startIcon={<DeleteOutline />}>
                Delete
            </Button>
            <Dialog open={open} onClose={handleClose} className="dialogbox" maxWidth="xs">
                <DialogTitle>Delete post?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search
                        results.
                    </DialogContentText>
                </DialogContent>
                <DialogActions className="delete-action">
                    <Button onClick={handleClose} className="btn cancel">
                        cancel
                    </Button>
                    <Button onClick={deletePost} className="btn delete">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withFirebase(DeleteComment);
