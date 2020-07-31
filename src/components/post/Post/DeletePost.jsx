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

const DeletePost = ({ firebase, postId }) => {
    const [open, setOpen] = useState(false);
    const { firestore } = firebase;

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deletePost = async () => {
        // Delete IMGs
        const getImgs = await firestore.collection("posts").doc(postId).get();
        getImgs.data().postImg.map((img) => {
            const storageImg = firebase.storage.refFromURL(img);
            return storageImg.delete();
        });

        // Delete Likes
        const getLikes = await firestore.collection("likes").where("postId", "==", postId).get();
        getLikes.forEach(function (doc) {
            doc.ref.delete();
        });

        // Delete Comments
        const getComments = await firestore.collection("comments").where("postId", "==", postId).get();
        getComments.forEach(function (doc) {
            doc.ref.delete();
        });

        // Delete post
        await firestore.collection("posts").doc(postId).delete();
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

export default withFirebase(DeletePost);
