import React, { useState } from "react";

import ReactGiphySearchbox from "react-giphy-searchbox";

/* Material UI */
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";

/* Icon */
import GifIcon from "@material-ui/icons/Gif";

const GifPickerDisplay = ({ uploadedImg, setChosenGif }) => {
    // POPOVER
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "add-gif" : undefined;

    return (
        <>
            <IconButton aria-describedby={id} onClick={handleClick} className="add-gif-button" disabled={uploadedImg.length > 0}>
                <GifIcon />
            </IconButton>
            <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}>
                <ReactGiphySearchbox
                    apiKey={process.env.REACT_APP_GIPHY_KEY}
                    onSelect={(gif) => {
                        setChosenGif(gif);
                        handleClose();
                    }}
                    poweredByGiphy={false}
                    imageBackgroundColor="#15202b"
                    searchFormClassName="search-gif"
                    wrapperClassName="add-gif-wrapper"
                    masonryConfig={[{ columns: 3, imageWidth: 200, gutter: 6 }]}
                    listWrapperClassName="list-gif-wrapper"
                    gifListHeight={600}
                />
            </Popover>
        </>
    );
};

export default GifPickerDisplay;
