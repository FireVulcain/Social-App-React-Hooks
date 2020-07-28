import React, { useContext, useState } from "react";

//Components
import DeleteComment from "./DeleteComment";

//context
import { GlobalContext } from "./../../../config/GlobalState/GlobalState";

// Material UI
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

//Icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export const CommentMenuAction = ({ commentId, commentUsername, postId, commentCount }) => {
    const { state } = useContext(GlobalContext);

    const {
        user: {
            credentials: { userName },
            authenticated,
        },
    } = state;

    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event, commentId) => {
        setOpen(commentId);
        setAnchorEl(event.target);
    };

    const handleClose = () => {
        setOpen(null);
        setAnchorEl(false);
    };

    return (
        <>
            {authenticated && commentUsername === userName ? (
                <>
                    <IconButton
                        onClick={(e) => {
                            handleClick(e, commentId);
                        }}
                        className="post-toggle-menu"
                        size="small"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                    <Menu className="menu-toggled" anchorEl={anchorEl} open={open === commentId} onClose={handleClose}>
                        <MenuItem className="menu-item menu-item-delete">
                            <DeleteComment commentId={commentId} postId={postId} commentCount={commentCount} />
                        </MenuItem>
                    </Menu>
                </>
            ) : null}
        </>
    );
};
