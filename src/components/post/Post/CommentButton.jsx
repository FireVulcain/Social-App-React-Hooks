import React from "react";

/* Material UI */
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";

import ChatBubbleOutlineRoundedIcon from "@material-ui/icons/ChatBubbleOutlineRounded";

const CommentButton = ({ commentCount }) => {
    return (
        <div className="comment-count">
            <IconButton aria-label="like" size="small">
                <ChatBubbleOutlineRoundedIcon />
            </IconButton>
            {commentCount > 0 ? (
                <Typography variant="body1" component="span">
                    {commentCount}
                </Typography>
            ) : null}
        </div>
    );
};

export default CommentButton;
