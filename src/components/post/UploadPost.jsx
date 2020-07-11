import React, { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";

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
import CancelIcon from "@material-ui/icons/Cancel";

const UploadPost = ({ firebase }) => {
    const { state } = useContext(GlobalContext);
    const { firestore } = firebase;

    const [postText, setPostText] = useState("");
    const [uploadedImg, setUploadedImg] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (postText === "" && uploadedImg.length === 0) return;

        setUploadLoading(true);

        Promise.all(
            uploadedImg.map((image) => {
                const fileExtension = image.name.split(".").pop();
                const randomName = `${uuidv4()}.${fileExtension}`;

                return firebase.storage.ref(`${state.user.credentials.userName}/${randomName}`).put(image);
            })
        )
            .then(async (url) => {
                const postImg = [];
                for (let i = 0; i < url.length; i++) {
                    const downloadURL = await url[i].ref.getDownloadURL();
                    postImg.push(downloadURL);
                }
                uploadPost(postImg);

                //reset state
                setPostText("");
                setUploadedImg([]);
                setUploadLoading(false);
            })
            .catch((err) => {
                setUploadLoading(false);
                console.log.log(err);
            });
    };

    const uploadPost = async (postImg) => {
        await firestore.collection("posts").doc().set({
            body: postText,
            commentCount: 0,
            createdAt: new Date().toISOString(),
            likeCount: 0,
            userImage: state.user.credentials.userImage,
            userName: state.user.credentials.userName,
            displayedName: state.user.credentials.displayedName,
            postImg,
        });
    };

    const handleUploadFile = (e) => {
        let files = e.target.files;
        let imgFile = [];

        if (uploadedImg.length >= 4 || files.length > 4) return;

        for (let i = 0; i < files.length; i++) {
            imgFile.push(e.target.files[i]);
        }

        setUploadedImg((prevState) => [...prevState, ...imgFile]);
    };

    const removeImg = (path) => {
        const uploadedImgCopy = [...uploadedImg];
        const index = uploadedImgCopy.indexOf(path);
        if (index > -1) uploadedImgCopy.splice(index, 1);

        return setUploadedImg(uploadedImgCopy);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={"upload-post" + (uploadLoading ? " upload-post-loading" : "")}>
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
                        {uploadedImg ? (
                            <div className="preview-img-container">
                                {uploadedImg.map((path, key) => {
                                    return (
                                        <div className="preview-img" key={key} style={{ backgroundImage: `url(${URL.createObjectURL(path)})` }}>
                                            <IconButton
                                                className="delete-img-post"
                                                onClick={() => removeImg(path)}
                                                aria-label="delete picture"
                                                component="button"
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                            <img src={URL.createObjectURL(path)} alt="" />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <input
                                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                                hidden
                                id="icon-button-file"
                                multiple
                                type="file"
                                onChange={handleUploadFile}
                            />
                            <label htmlFor="icon-button-file">
                                <IconButton className="upload-img" aria-label="upload image" component="span">
                                    <CropOriginalOutlinedIcon />
                                </IconButton>
                            </label>
                            <Button
                                disabled={postText === "" && uploadedImg.length === 0}
                                type="submit"
                                variant="contained"
                                className="submit-button"
                            >
                                Post
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </form>
        </>
    );
};

export default withFirebase(UploadPost);
