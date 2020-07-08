import React from "react";

/* components */
import Posts from "./../components/post/Posts";
import UploadPost from "./../components/post/UploadPost";

/* Context */
import { withAuthorization } from "./../config/Session";

const Home = () => {
    return (
        <>
            <UploadPost />
            <Posts />
        </>
    );
};

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(Home);
