import React from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "./../../constants/routes";

export const NavigationNonAuth = () => {
    return (
        <ul>
            <li>
                <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
            </li>
            <li>
                <Link to={ROUTES.SIGN_IN}>Sign In</Link>
            </li>
        </ul>
    );
};
