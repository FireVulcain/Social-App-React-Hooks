import React, { useState } from "react";

//context
import { withFirebase } from "../../config/Firebase/context";

//Mui stuff
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
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
        await firestore.collection("posts").doc(postId).delete();
    };
    return (
        <>
            <IconButton onClick={handleOpen}>
                <DeleteOutline color="secondary" />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete post ?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        cancel
                    </Button>
                    <Button onClick={deleteScream} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default withFirebase(DeletePost);
