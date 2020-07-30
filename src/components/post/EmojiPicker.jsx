import React from "react";
import Picker from "emoji-picker-react";

/* Material UI */
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";

/* Icon */
import SentimentSatisfiedOutlinedIcon from "@material-ui/icons/SentimentSatisfiedOutlined";

const EmojiPicker = ({ setChosenEmoji }) => {
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject.emoji);
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
                    horizontal: "center",
                }}
            >
                <Picker onEmojiClick={onEmojiClick} disableAutoFocus={true} />
            </Popover>
        </>
    );
};

export default EmojiPicker;
