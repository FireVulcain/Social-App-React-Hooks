import React from "react";

import SinglePost from "../components/post/SinglePost";

export const Post = (props) => {
    const postId = props.match.params.postId;
    return <SinglePost postId={postId} />;
};
