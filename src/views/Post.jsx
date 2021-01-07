import React from "react";

import SinglePost from "../components/post/SinglePost";

/* Context */
import { withAuthorization } from "./../config/Session";

const Post = (props) => {
    const postId = props.match.params.postId;
    return <SinglePost postId={postId} />;
};

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(Post);
