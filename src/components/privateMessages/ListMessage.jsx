import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { SubmitMessage } from "./SubmitMessage";

const ListMessage = ({ roomOpen, firebase, loggedUserId, roomUserNotLogged }) => {
    const [listMessages, setListMessages] = useState([]);

    const ScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    useEffect(() => {
        const messages = firebase.firestore
            .collection("messages")
            .doc(roomOpen)
            .collection(roomOpen)
            .orderBy("createdAt", "asc")
            .onSnapshot((querySnapshot) => {
                const messagesArr = [];
                querySnapshot.forEach((doc) => {
                    messagesArr.push(doc.data());
                });
                setListMessages(messagesArr);
            });

        return () => {
            messages();
        };
    }, [roomOpen, firebase.firestore]);

    return (
        <Box className="list-messages">
            {listMessages && listMessages.length > 0 ? (
                <>
                    <div>
                        {listMessages.map((message, key) => {
                            const profilePicture = loggedUserId === message.recipientId ? roomUserNotLogged.userImage : null;
                            const userLink = loggedUserId === message.recipientId ? roomUserNotLogged.userName : null;

                            const classNameMsg = loggedUserId === message.senderId ? "sender" : "recipient";
                            const classNameImg = message.contentImg ? " withImg" : "";
                            return (
                                <div className="single-message" key={key}>
                                    {profilePicture && userLink ? (
                                        <Box display="flex" alignItems="center">
                                            <Link to={`/user/${userLink}`}>
                                                <Avatar alt={userLink} src={profilePicture} className="avatar" />
                                            </Link>
                                            <div className={`${classNameMsg}`}>
                                                <Typography component="span" variant="body2">
                                                    {message.content}
                                                </Typography>
                                            </div>
                                        </Box>
                                    ) : (
                                        <div className={`${classNameMsg} ${classNameImg} `}>
                                            {message.contentImg ? <img src={message.contentImg} alt="" /> : null}
                                            {message.content ? (
                                                <Typography component="span" variant="body2">
                                                    {message.content}
                                                </Typography>
                                            ) : null}
                                        </div>
                                    )}
                                    <Typography component="div" variant="body2" className={`${classNameMsg} message-date`}>
                                        {dayjs(message.createdAt).format("H:mm A")}
                                    </Typography>
                                </div>
                            );
                        })}
                        <ScrollToBottom />
                    </div>
                </>
            ) : null}
            <SubmitMessage firebase={firebase} roomOpen={roomOpen} roomUserNotLogged={roomUserNotLogged} loggedUserId={loggedUserId} />
        </Box>
    );
};

export default ListMessage;
