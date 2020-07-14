import React from "react";
import ModalImage from "react-modal-image";

/* Material UI */
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

export const PostBody = ({ body, postImg }) => {
    return (
        <Box>
            <Typography variant="body1">{body}</Typography>

            {postImg ? (
                <div className="post-img-container">
                    {postImg.map((postImg, key) => {
                        return (
                            <div className="post-img" key={key} style={{ backgroundImage: `url(${postImg})` }}>
                                <ModalImage hideDownload={true} hideZoom={true} small={postImg} large={postImg} />
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </Box>
    );
};
