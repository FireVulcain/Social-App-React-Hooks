import React from "react";

/* Material UI */
import IconButton from "@material-ui/core/IconButton";
/* Material UI Icons */
import CancelIcon from "@material-ui/icons/Cancel";

export const ImagePreview = ({ uploadedImg, setUploadedImg }) => {
    const removeUploadedFile = (path) => {
        const uploadedImgCopy = [...uploadedImg];
        const index = uploadedImgCopy.indexOf(path);
        if (index > -1) uploadedImgCopy.splice(index, 1);

        return setUploadedImg(uploadedImgCopy);
    };

    return (
        <div className="preview-img-container">
            {uploadedImg.map((path, key) => {
                return (
                    <div className="preview-img" key={key} style={{ backgroundImage: `url(${URL.createObjectURL(path)})` }}>
                        <IconButton
                            className="delete-img-post"
                            onClick={() => removeUploadedFile(path)}
                            aria-label="delete picture"
                            component="button"
                        >
                            <CancelIcon />
                        </IconButton>
                        <img src={URL.createObjectURL(path)} alt="" />
                    </div>
                );
            })}
        </div>
    );
};
