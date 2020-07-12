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
    const deleteScream = async () => {
        const getImgs = await firestore.collection("posts").doc(postId).get();
        getImgs.data().postImg.map((img) => {
            const storageImg = firebase.storage.refFromURL(img);
            return storageImg.delete();
        });
        await firestore.collection("posts").doc(postId).delete();
    };
    return (
        <>
            <Button onClick={handleOpen} startIcon={<DeleteOutline />}>
                Delete
            </Button>
            <Dialog open={open} onClick={(e) => e.stopPropagation()} onClose={handleClose} className="delete-dialogbox" maxWidth="xs">
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
                    <Button onClick={deleteScream} className="btn delete">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withFirebase(DeletePost);
