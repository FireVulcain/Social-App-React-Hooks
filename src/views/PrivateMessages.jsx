import React, { useContext, useState, useEffect } from "react";

import { withRouter } from "react-router-dom";

/* Constants */
import * as ROUTES from "./../constants/routes";

//context
import { withFirebase } from "./../config/Firebase/context";
import { GlobalContext } from "./../config/GlobalState/GlobalState";
import { withAuthorization } from "./../config/Session";

/* Components */
import { ListPrivateMessages } from "../components/privateMessages/ListPrivateMessages";

/* Material UI */
import Box from "@material-ui/core/Box";
import ListMessage from "../components/privateMessages/ListMessage";

const PrivateMessages = ({ firebase, match, history }) => {
    const { state } = useContext(GlobalContext);

    const {
        user: {
            credentials: { userId },
        },
    } = state;

    const [roomOpen, setRoomOpen] = useState("");
    const [roomUserNotLogged, setRoomUserNotLogged] = useState({});

    useEffect(() => {
        if (match.params.roomId && userId) {
            if (match.params.roomId.includes(userId)) {
                setRoomOpen(match.params.roomId);
                const availableUser = match.params.roomId.split("-");
                const roomUserId = availableUser.filter((e) => e !== userId)[0];
                firebase.firestore
                    .collection("users")
                    .where("userId", "==", roomUserId)
                    .get()
                    .then((res) => {
                        res.forEach((element) => {
                            setRoomUserNotLogged(element.data());
                        });
                    });
            }
        }
    }, [match, userId, firebase.firestore]);

    useEffect(() => {
        if (roomOpen) {
            history.push(`${ROUTES.MESSAGES}/${roomOpen}`);
        }
    }, [roomOpen, history]);

    return (
        <Box display="flex" alignItems="align-start">
            <ListPrivateMessages loggedUserId={userId} firebase={firebase} roomOpen={roomOpen} setRoomOpen={setRoomOpen} />
            {roomOpen && roomOpen !== "" ? (
                <ListMessage roomOpen={roomOpen} firebase={firebase} loggedUserId={userId} roomUserNotLogged={roomUserNotLogged} />
            ) : null}
        </Box>
    );
};

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(withFirebase(withRouter(PrivateMessages)));
