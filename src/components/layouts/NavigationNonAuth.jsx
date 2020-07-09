import React from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "./../../constants/routes";

import Typography from "@material-ui/core/Typography";

export const NavigationNonAuth = () => {
    return (
        <nav className="nav nav-not-logged">
            <ul>
                <li>
                    <Link to={ROUTES.SIGN_UP}>
                        <Typography variant="body1" component="span">
                            Sign Up
                        </Typography>
                    </Link>
                </li>
                <li>
                    <Link to={ROUTES.SIGN_IN}>
                        <Typography variant="body1" component="span">
                            Log in
                        </Typography>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
