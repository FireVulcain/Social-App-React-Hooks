import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ImagesUpload } from "../post/UploadPost/ImagesUpload";

import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";

import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";

export const SubmitMessage = ({ firebase, roomOpen, roomUserNotLogged, loggedUserId }) => {
    const [message, setMessage] = useState("");
    const [isFocus, setIsFocus] = useState(false);

    const [uploadedImg, setUploadedImg] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);

    const handleSubmitMessage = async (img) => {
        await firebase.firestore.collection("messages").doc(roomOpen).collection(roomOpen).add({
            content: message,
            contentImg: img,
            createdAt: new Date().toISOString(),
            recipientId: roomUserNotLogged.userId,
            senderId: loggedUserId,
        });

        const getRoom = await firebase.firestore.collection("rooms").where("roomKey", "==", roomOpen).get();

        getRoom.forEach(async (room) => {
            await firebase.firestore.collection("rooms").doc(room.id).update({
                lastMessage: new Date().toISOString(),
            });
        });

        setMessage("");
        setUploadedImg("");
        setUploadLoading(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUploadLoading(true);
        if (uploadedImg) {
            const fileExtension = uploadedImg.name.split(".").pop();
            const randomName = `${uuidv4()}.${fileExtension}`;
            firebase.storage
                .ref(`${roomOpen}/${randomName}`)
                .put(uploadedImg)
                .then(async (url) => {
                    const downloadURL = await url.ref.getDownloadURL();
                    handleSubmitMessage(downloadURL);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            handleSubmitMessage("");
        }
    };
    return (
        <form onSubmit={handleSubmit} className={`private-message-form ${uploadedImg ? "withImg" : ""} ${uploadLoading ? "uploading-message" : ""}`}>
            {!uploadedImg ? (
                <ImagesUpload chosenGif={null} handleUploadFile={(e) => setUploadedImg(e.target.files[0])} multiple={false} />
            ) : (
                <div className="img-upload-preview">
                    <IconButton className="delete-img-message" onClick={() => setUploadedImg("")} aria-label="delete picture" component="button">
                        <CancelIcon />
                    </IconButton>
                    <img src={URL.createObjectURL(uploadedImg)} alt="" />
                </div>
            )}
            <div className="text-field-container">
                <TextField
                    type="text"
                    placeholder="Start a new message"
                    value={message}
                    multiline
                    onChange={(e) => setMessage(e.target.value)}
                    className={`message-text-field ${isFocus ? "message-text-field-focused" : ""}`}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    disabled={uploadLoading}
                />
                <IconButton
                    disabled={(message === "" && uploadedImg === "") || uploadLoading}
                    type="submit"
                    variant="contained"
                    className="send-message-button"
                >
                    <SendIcon />
                </IconButton>
            </div>
        </form>
    );
};
