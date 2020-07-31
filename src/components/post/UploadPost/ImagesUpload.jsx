import React from "react";

/* Material UI */
import IconButton from "@material-ui/core/IconButton";
/* Material UI Icons */
import CropOriginalOutlinedIcon from "@material-ui/icons/CropOriginalOutlined";

export const ImagesUpload = ({ chosenGif, handleUploadFile }) => {
    return (
        <>
            <input
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                hidden
                id="icon-button-file"
                multiple
                type="file"
                onChange={handleUploadFile}
                disabled={chosenGif !== null}
            />
            <label htmlFor="icon-button-file">
                <IconButton className="upload-img" aria-label="upload image" component="span" disabled={chosenGif !== null}>
                    <CropOriginalOutlinedIcon />
                </IconButton>
            </label>
        </>
    );
};
