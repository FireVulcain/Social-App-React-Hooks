import React from "react";
import { Link } from "react-router-dom";

// Material UI
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";

export const UserAvatar = ({ userName, userImage }) => {
    return (
        <Box mr={2} className="user-info">
            <Link to={`/user/${userName}`}>
                <Avatar alt={userName} src={userImage} className="avatar" />
            </Link>
        </Box>
    );
};
