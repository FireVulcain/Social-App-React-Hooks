import React, { useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

/* Components */
import { ImagesUpload } from "./UploadPost/ImagesUpload";
import { ImagePreview } from "./UploadPost/ImagePreview";
import EmojiPicker from "./UploadPost/EmojiPicker";
import GifPicker from "./UploadPost/GifPicker";
import { GifPreview } from "./UploadPost/GifPreview";

//context
import { withFirebase } from "../../config/Firebase/context";
import { GlobalContext } from "../../config/GlobalState/GlobalState";

/* Material UI */
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { SnackBarAlert } from "./UploadPost/SnackBarAlert";

const UploadPost = ({ firebase }) => {
    const { state } = useContext(GlobalContext);
    const { firestore } = firebase;

    const {
        user: {
            credentials: { userName, userImage, displayedName },
        },
    } = state;

    const [postText, setPostText] = useState("");
    const [selectionStart, setSelectionStart] = useState(0);
    const [uploadedImg, setUploadedImg] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [tooManyFiles, setTooManyFiles] = useState(false);

    const [chosenEmoji, setChosenEmoji] = useState(null);

    const [chosenGif, setChosenGif] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (postText === "" && uploadedImg.length === 0 && chosenGif === null) return;

        setUploadLoading(true);

        Promise.all(
            uploadedImg.map((image) => {
                const fileExtension = image.name.split(".").pop();
                const randomName = `${uuidv4()}.${fileExtension}`;

                return firebase.storage.ref(`${userName}/${randomName}`).put(image);
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
                setChosenEmoji(null);
                setChosenGif(null);
            })
            .catch((err) => {
                setUploadLoading(false);
                console.log.log(err);
            });
    };
    const handleUploadFile = (e) => {
        let files = e.target.files;
        let imgFile = [];

        if (uploadedImg.length >= 4 || files.length > 4) return setTooManyFiles(true);

        for (let i = 0; i < files.length; i++) {
            imgFile.push(e.target.files[i]);
        }

        setUploadedImg((prevState) => [...prevState, ...imgFile]);
    };

    const uploadPost = async (postImg) => {
        await firestore.collection("posts").doc().set({
            body: postText,
            commentCount: 0,
            createdAt: new Date().toISOString(),
            likeCount: 0,
            userImage: userImage,
            userName: userName,
            displayedName: displayedName,
            postImg,
            gif: chosenGif,
        });
    };

    useEffect(() => {
        if (chosenEmoji) {
            let startPosition = postText.substring(0, selectionStart);
            let endPosition = postText.substring(selectionStart);

            if (startPosition !== endPosition) {
                setPostText(startPosition + chosenEmoji + endPosition);
            } else {
                setPostText(startPosition + chosenEmoji);
            }

            setChosenEmoji(null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chosenEmoji]);

    const handleChange = (e) => {
        setPostText(e.target.value);
        setSelectionStart(e.target.selectionStart);
    };

    const handleKeyUp = (e) => {
        if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40) {
            setSelectionStart(e.target.selectionStart);
        }
    };
    return (
        <>
            <SnackBarAlert tooManyFiles={tooManyFiles} setTooManyFiles={setTooManyFiles} />
            <form onSubmit={handleSubmit} className={"upload-post" + (uploadLoading ? " upload-post-loading" : "")}>
                <Box display="flex" alignItems="flex-start">
                    <Box mr={2}>
                        <Avatar alt={userName} src={userImage} className="avatar" />
                    </Box>
                    <Box width={1}>
                        <TextField
                            type="text"
                            placeholder="Post a message"
                            onChange={(e) => handleChange(e)}
                            onKeyUp={(e) => handleKeyUp(e)}
                            onClick={(e) => setSelectionStart(e.target.selectionStart)}
                            value={postText}
                            multiline
                            className="text-field"
                        />

                        {uploadedImg ? <ImagePreview uploadedImg={uploadedImg} setUploadedImg={setUploadedImg} /> : null}
                        {chosenGif ? <GifPreview setChosenGif={setChosenGif} chosenGif={chosenGif} /> : null}

                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <ImagesUpload chosenGif={chosenGif} handleUploadFile={handleUploadFile} />
                                <EmojiPicker setChosenEmoji={setChosenEmoji} />
                                <GifPicker uploadedImg={uploadedImg} setChosenGif={setChosenGif} />
                            </Box>
                            <Button
                                disabled={postText === "" && uploadedImg.length === 0 && chosenGif === null}
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
