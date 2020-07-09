import React from "react";

export const Post = (props) => {
    const postId = props.match.params.id;
    return <div>Post Page : {postId}</div>;
};
