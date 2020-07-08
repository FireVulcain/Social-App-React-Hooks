import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase/context";
import * as ROUTES from "./../../constants/routes";

const withAuthorization = (condition) => (Component) => {
    const WithAuthorization = (props) => {
        useEffect(() => {
            props.firebase.auth.onAuthStateChanged((authUser) => {
                if (!condition(authUser)) {
                    props.history.push(ROUTES.SIGN_IN);
                }
                // else if (authUser && condition(authUser) == "not_authenticated") {
                //     props.history.push(ROUTES.SIGN_IN);
                // }
            });

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <AuthUserContext.Consumer>{(authUser) => (condition(authUser) ? <Component {...props} /> : null)}</AuthUserContext.Consumer>;
    };

    return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
