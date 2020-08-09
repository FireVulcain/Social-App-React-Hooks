import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";

import SendIcon from "@material-ui/icons/Send";
export const SubmitMessage = ({ firebase, roomOpen, roomUserNotLogged, loggedUserId }) => {
    const [message, setMessage] = useState("");
    const [isFocus, setIsFocus] = useState(false);

    const handleSubmitMessage = async (e) => {
        e.preventDefault();

        await firebase.firestore.collection("messages").doc(roomOpen).collection(roomOpen).add({
            content: message,
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
    };

    return (
        <form onSubmit={handleSubmitMessage} className="private-message-form">
            <TextField
                type="text"
                placeholder="Start a new message"
                value={message}
                multiline
                onChange={(e) => setMessage(e.target.value)}
                className={`message-text-field ${isFocus ? "message-text-field-focused" : ""}`}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
            />
            <IconButton disabled={message === ""} type="submit" variant="contained" className="send-message-button">
                <SendIcon />
            </IconButton>
        </form>
    );
};
