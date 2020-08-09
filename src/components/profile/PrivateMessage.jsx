import React, { useContext } from "react";
import { withRouter } from "react-router-dom";

/* Constants */
import * as ROUTES from "./../../constants/routes";

/* Context */
import { GlobalContext } from "../../config/GlobalState/GlobalState";

import IconButton from "@material-ui/core/IconButton";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

const PrivateMessage = ({ firebase, userName, history }) => {
    const { state } = useContext(GlobalContext);

    const handleClick = async () => {
        const getUserCredentials = await firebase.firestore.collection("users").where("userName", "==", userName).get();

        getUserCredentials.forEach(async (user) => {
            const roomOne = `${state.user.credentials.userId}-${user.data().userId}`;
            const roomTwo = `${user.data().userId}-${state.user.credentials.userId}`;

            const doesRoomOneExist = await firebase.firestore.collection("rooms").where("roomKey", "==", roomOne).get();
            const doesRoomTwoExist = await firebase.firestore.collection("rooms").where("roomKey", "==", roomTwo).get();

            if (!doesRoomOneExist.empty || !doesRoomTwoExist.empty) {
                if (!doesRoomOneExist.empty) {
                    return history.push(`${ROUTES.MESSAGES}/${roomOne}`);
                } else {
                    return history.push(`${ROUTES.MESSAGES}/${roomTwo}`);
                }
            } else {
                await firebase.firestore.collection("rooms").add({
                    availableUsers: [state.user.credentials.userId, user.data().userId],
                    lastMessage: "",
                    roomKey: roomOne,
                });
                return history.push(`${ROUTES.MESSAGES}/${roomOne}`);
            }
        });
    };
    return (
        <IconButton onClick={handleClick} className="profile-private-message-button">
            <MailOutlineIcon />
        </IconButton>
    );
};

export default withRouter(PrivateMessage);
