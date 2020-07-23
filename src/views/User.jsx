import React from "react";

/* Context */
import { withAuthorization } from "./../config/Session";

/* Component */
import Banner from "./../components/profile/Banner";
import Posts from "./../components/post/Posts";

const User = (props) => {
    const userName = props.match.params.userName;
    return (
        <div>
            <Banner userName={userName} />
            <Posts userNamePosts={userName} />
        </div>
    );
};

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(User);
