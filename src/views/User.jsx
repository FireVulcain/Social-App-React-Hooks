import React, { useContext } from "react";

/* Context */
import { GlobalContext } from "./../config/GlobalState/GlobalState";
import { withAuthorization } from "./../config/Session";

/* Component */
import Banner from "./../components/profile/Banner";
import Posts from "./../components/post/Posts";

const User = (props) => {
    const { state } = useContext(GlobalContext);

    return (
        <div>
            <Banner userName={props.match.params.userName} loggedUser={state.user.credentials.userName} />
            <Posts userNamePosts={props.match.params.userName} />
        </div>
    );
};

const condition = (authUser) => !!authUser;
export default withAuthorization(condition)(User);
