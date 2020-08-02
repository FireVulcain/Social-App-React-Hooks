import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* Context */
import { withFirebase } from "./../config/Firebase/context";
import { GlobalContext } from "./../config/GlobalState/GlobalState";
import { withAuthorization } from "./../config/Session";

/* Material UI */
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import SvgIcon from "@material-ui/core/SvgIcon";
import CircularProgress from "@material-ui/core/CircularProgress";

import LikedPost from "@material-ui/icons/Favorite";

const Notifications = ({ firebase }) => {
    const { state } = useContext(GlobalContext);
    const {
        user: { notifications },
    } = state;

    const [userProfils, setUserProfils] = useState([]);

    useEffect(() => {
        if (notifications && notifications.length > 0) {
            notifications.forEach(async (notification) => {
                const getUser = await firebase.firestore.collection("users").where("userName", "==", notification.sender).get();
                getUser.forEach((user) => {
                    setUserProfils((prevState) => {
                        if (!prevState.filter((u) => u.userName === user.data().userName).length > 0) {
                            return [...prevState, user.data()];
                        }
                        return [...prevState];
                    });
                });
            });
        }
    }, [notifications, firebase.firestore]);

    const handleMouseEnter = async (notifId, isRead) => {
        if (!isRead) {
            await firebase.firestore.collection("notifications").doc(notifId).update({
                read: true,
            });
        }
    };

    return (
        <div className="notifications-container">
            <Typography component="h1">Notifications</Typography>
            {notifications !== null ? (
                <>
                    {notifications.length > 0 && userProfils && userProfils.length > 0 ? (
                        <>
                            {notifications.map((notification, key) => {
                                const verb = notification.type === "like" ? "liked" : "commented on";

                                const getUserImg = userProfils.filter((user) => user.userName === notification.sender);
                                const userImg = getUserImg.length > 0 ? getUserImg[0].userImage : null;

                                const getUserName = userProfils.filter((user) => user.userName === notification.sender);
                                const userName = getUserName.length > 0 ? getUserImg[0].userName : null;

                                const className = notification.read ? "notification-read" : "notification-not-read";

                                return (
                                    <Box
                                        className={`notification-item ${className}`}
                                        key={key}
                                        onMouseEnter={() => handleMouseEnter(notification.id, notification.read)}
                                    >
                                        <Link
                                            to={`/${notification.recipient}/post/${notification.postId}`}
                                            className="notification-global-link"
                                        ></Link>
                                        <Box display="flex" alignItems="flex-start">
                                            {notification.type === "like" ? (
                                                <LikedPost />
                                            ) : (
                                                <SvgIcon className="comment-icon">
                                                    <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                                                </SvgIcon>
                                            )}
                                            <Box>
                                                <Link to={`/user/${userName}`} className="notification-user-link">
                                                    <Avatar alt={notification.sender} src={userImg} className="avatar" />
                                                </Link>
                                                <Typography component="p" variant="body2" className="notifciation-user-infos">
                                                    <Link to={`/user/${userName}`} className="notification-user-link notification-userName">
                                                        {notification.sender}
                                                    </Link>
                                                    {` ${verb} your post`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </>
                    ) : (
                        <Box display="flex" justifyContent="center">
                            <CircularProgress size={30} />
                        </Box>
                    )}
                </>
            ) : (
                <Typography className="no-notificiations">No notifications yet</Typography>
            )}
        </div>
    );
};

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(withFirebase(Notifications));
