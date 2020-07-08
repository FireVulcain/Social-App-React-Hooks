import React, { useState, useContext } from "react";

//context
import { withFirebase } from "../../config/Firebase/context";
import { GlobalContext } from "../../config/GlobalState/GlobalState";

/* Material UI */
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

/* Material UI Icons */
import CropOriginalOutlinedIcon from "@material-ui/icons/CropOriginalOutlined";

const UploadPost = ({ firebase }) => {
    const { state } = useContext(GlobalContext);
    const { firestore } = firebase;

    const [postText, setPostText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        uploadPost();
        setPostText("");
    };

    const uploadPost = async () => {
        await firestore.collection("posts").doc().set({
            body: postText,
            commentCount: 0,
            createdAt: new Date().toISOString(),
            likeCount: 0,
            userImage: state.user.credentials.userImage,
            userName: state.user.credentials.userName,
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="upload-post">
                <Box display="flex" alignItems="flex-start">
                    <Box mr={2}>
                        <Avatar alt={state.user.credentials.userName} src={state.user.credentials.userImage} className="avatar" />
                    </Box>
                    <Box width={1}>
                        <TextField
                            type="text"
                            placeholder="Post a message"
                            onChange={(e) => setPostText(e.target.value)}
                            value={postText}
                            multiline
                            className="text-field"
                        />

                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <input hidden accept="image/*" id="icon-button-file" type="file" />
                            <label htmlFor="icon-button-file">
                                <IconButton color="primary" aria-label="upload image" component="span">
                                    <CropOriginalOutlinedIcon />
                                </IconButton>
                            </label>
                            <Button type="submit" variant="contained" color="primary">
                                Post !
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </form>
        </>
    );
};

export default withFirebase(UploadPost);
