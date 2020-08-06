import React, { useContext, useState } from "react";

//context
import { withFirebase } from "./../config/Firebase/context";
import { GlobalContext } from "./../config/GlobalState/GlobalState";
import { withAuthorization } from "./../config/Session";

/* Components */
import { ListPrivateMessages } from "../components/privateMessages/ListPrivateMessages";

/* Material UI */
import Box from "@material-ui/core/Box";
import ListMessage from "../components/privateMessages/ListMessage";

const PrivateMessages = ({ firebase }) => {
    const { state } = useContext(GlobalContext);

    const {
        user: {
            credentials: { userId },
        },
    } = state;

    const [roomOpen, setRoomOpen] = useState("");
    const [roomUserNotLogged, setRoomUserNotLogged] = useState({});

    return (
        <Box display="flex" alignItems="align-start">
            <ListPrivateMessages loggedUserId={userId} firebase={firebase} setRoomOpen={setRoomOpen} setRoomUserNotLogged={setRoomUserNotLogged} />
            {roomOpen && roomOpen !== "" ? (
                <ListMessage roomOpen={roomOpen} firebase={firebase} loggedUserId={userId} roomUserNotLogged={roomUserNotLogged} />
            ) : null}
        </Box>
    );
};

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(withFirebase(PrivateMessages));
