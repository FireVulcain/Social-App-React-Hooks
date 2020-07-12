import React, { useContext, useState } from "react";

//Components
import DeletePost from "./DeletePost";

//context
import { GlobalContext } from "./../../../config/GlobalState/GlobalState";

// Material UI
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//Icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export const PostMenuAction = ({ postId, postUsername }) => {
    const { state } = useContext(GlobalContext);

    const {
        user: {
            credentials: { userName },
            authenticated,
        },
    } = state;

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event, postId) => {
        setOpen(postId);
        setAnchorEl(event.target);
    };

    const handleClose = () => {
        setOpen(null);
        setAnchorEl(false);
    };

    return (
        <>
            <IconButton
                onClick={(e) => {
                    handleClick(e, postId);
                }}
                className="post-toggle-menu"
                size="small"
            >
                <ExpandMoreIcon />
            </IconButton>
            <Menu
                className="menu-toggled"
                anchorEl={anchorEl}
                open={open === postId}
                onClose={(e) => {
                    e.stopPropagation();
                    handleClose();
                }}
            >
                {authenticated && postUsername === userName ? (
                    <MenuItem className="menu-item menu-item-delete">
                        <DeletePost postId={postId} />
                    </MenuItem>
                ) : null}
            </Menu>
        </>
    );
};
