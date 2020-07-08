import React from "react";

/* components */
import Posts from "./../components/post/Posts";
import UploadPost from "./../components/post/UploadPost";

export const Home = () => {
    return (
        <>
            <UploadPost />
            <Posts />
        </>
    );
};
