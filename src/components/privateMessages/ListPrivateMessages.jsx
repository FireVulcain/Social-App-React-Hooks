import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

/* Material UI */
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

export const ListPrivateMessages = ({ loggedUserId, firebase, setRoomOpen, setRoomUserNotLogged }) => {
    const [rooms, setRooms] = useState([]);

    const [listUsers, setListUsers] = useState([]);

    useEffect(() => {
        if (loggedUserId) {
            const getRooms = async () => {
                const rooms = await firebase.firestore
                    .collection("rooms")
                    .orderBy("lastMessage", "desc")
                    .where("availableUsers", "array-contains", loggedUserId)
                    .get();

                const roomsArr = [];
                rooms.forEach((element) => {
                    roomsArr.push(element.data());
                });

                setRooms(roomsArr);
            };
            getRooms();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedUserId]);

    useEffect(() => {
        if (rooms.length > 0) {
            rooms.map(async (room) => {
                const roomUserId = room.availableUsers.filter((e) => e !== loggedUserId)[0];
                const users = await firebase.firestore.collection("users").where("userId", "==", roomUserId).get();

                users.forEach((element) => {
                    const roomKey = room.roomKey;
                    setListUsers((prevState) => [...prevState, { roomKey, ...element.data() }]);
                });
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rooms]);

    return (
        <div className="private-message-list">
            {listUsers && listUsers.length > 0
                ? listUsers.map((user, key) => {
                      return (
                          <Box
                              display="flex"
                              alignItems="center"
                              key={key}
                              className="single-message-info"
                              onClick={() => {
                                  setRoomOpen(`${user.roomKey}`);
                                  setRoomUserNotLogged(user);
                              }}
                          >
                              <Link to={`/user/${user.userName}`}>
                                  <Avatar alt={user.userName} src={user.userImage} className="avatar" />
                              </Link>
                              <Box ml={2} display="flex" alignItems="center">
                                  <Typography variant="h6" component="p" className="dm-displayed-name">
                                      {user.displayedName}
                                  </Typography>
                                  <Typography variant="body2" component="p" className="dm-username">
                                      @{user.userName}
                                  </Typography>
                              </Box>
                          </Box>
                      );
                  })
                : null}
        </div>
    );
};
