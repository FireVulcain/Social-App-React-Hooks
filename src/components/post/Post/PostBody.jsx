import React from "react";
import ModalImage from "react-modal-image";

import { Gif } from "@giphy/react-components";

import Twemoji from "react-twemoji";
import Linkify from "react-linkify";

/* Material UI */
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

export const PostBody = ({ body, postImg, gif }) => {
    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer" className="post-link">
            {text}
        </a>
    );

    return (
        <Box className="post-body">
            {body ? (
                <Linkify componentDecorator={componentDecorator}>
                    <Twemoji options={{ className: "twemoji" }} noWrapper={true}>
                        <Typography variant="body1">{body}</Typography>
                    </Twemoji>
                </Linkify>
            ) : null}

            {postImg.length > 0 ? (
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
            {gif ? (
                <Gif
                    gif={gif}
                    width={500}
                    onGifClick={(gif, e) => {
                        e.preventDefault();
                        window.open(gif.url, "_blank");
                    }}
                />
            ) : null}
        </Box>
    );
};
