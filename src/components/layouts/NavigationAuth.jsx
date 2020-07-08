import React from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "./../../constants/routes";

import SignOutButton from "../auth/SignOut";

export const NavigationAuth = () => {
    return (
        <ul>
            <li>
                <Link to={ROUTES.HOME}>Home</Link>
            </li>
            <li>
                <SignOutButton />
            </li>
        </ul>
    );
};
