import React from "react";

/* Context */
import { AuthUserContext } from "../../config/Session";

/* Components */
import { NavigationAuth } from "./NavigationAuth";
import { NavigationNonAuth } from "./NavigationNonAuth";

const Navigation = () => {
    return <AuthUserContext.Consumer>{(authUser) => (authUser !== null ? <NavigationAuth /> : <NavigationNonAuth />)}</AuthUserContext.Consumer>;
};

export default Navigation;
