import React from "react";

import { Gif } from "@giphy/react-components";

/* Material UI */
import IconButton from "@material-ui/core/IconButton";
/* Material UI Icons */
import CancelIcon from "@material-ui/icons/Cancel";

export const GifPreview = ({ setChosenGif, chosenGif }) => {
    return (
        <div className="preview-gif-container">
            <div className="preview-gif">
                <IconButton className="delete-gif-post" onClick={() => setChosenGif(null)} component="button">
                    <CancelIcon />
                </IconButton>
                {<Gif gif={chosenGif} width={500} />}
            </div>
        </div>
    );
};
