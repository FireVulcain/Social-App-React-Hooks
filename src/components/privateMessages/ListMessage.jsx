import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

// Material UI
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

const ListMessage = ({ roomOpen, firebase, loggedUserId, roomUserNotLogged }) => {
    const [listMessages, setListMessages] = useState([]);
    useEffect(() => {
        const getMessages = async () => {
            const messagesRef = await firebase.firestore.collection("messages").doc(roomOpen).collection(roomOpen).get();
            const messagesArr = [];
            messagesRef.forEach((element) => {
                messagesArr.push(element.data());
            });

            setListMessages(messagesArr);
        };

        getMessages();
    }, [roomOpen, firebase.firestore]);
    return (
        <Box className="list-messages">
            {listMessages && listMessages.length > 0
                ? listMessages.map((message, key) => {
                      const profilePicture = loggedUserId === message.recipientId ? roomUserNotLogged.userImage : null;
                      const userLink = loggedUserId === message.recipientId ? roomUserNotLogged.userName : null;

                      const classNameMsg = loggedUserId === message.senderId ? "sender" : "recipient";
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
                                  <div className={`${classNameMsg}`}>
                                      <Typography component="span" variant="body2">
                                          {message.content}
                                      </Typography>
                                  </div>
                              )}
                              <Typography component="div" variant="body2" className={`${classNameMsg} message-date`}>
                                  {dayjs(message.createdAt).format("H:mm A")}
                              </Typography>
                          </div>
                      );
                  })
                : null}
        </Box>
    );
};

export default ListMessage;
