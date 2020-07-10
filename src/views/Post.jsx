import React from "react";

export const Post = (props) => {
    const postId = props.match.params.postId;
    return <div>Post Page : {postId}</div>;
};
