import React from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

/* Material UI */
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";

/* Icon */
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";

const EmojiPicker = ({ setChosenEmoji }) => {
    const onEmojiClick = (emojiObject) => {
        setChosenEmoji(emojiObject.native);
    };

    // POPOVER
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <>
            <IconButton aria-describedby={id} onClick={handleClick} className="add-smiley">
                <SentimentSatisfiedOutlinedIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Picker set="twitter" onSelect={onEmojiClick} theme="dark" title="" emoji="" />
            </Popover>
        </>
    );
};

export default EmojiPicker;
