import React from "react";
import { Link } from "react-router-dom";

import * as ROUTES from "./../../constants/routes";

import SignOutButton from "../auth/SignOut";

import IconButton from "@material-ui/core/IconButton";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";

export const NavigationAuth = () => {
    return (
        <nav className="nav">
            <ul>
                <li>
                    <Link to={ROUTES.HOME}>
                        <IconButton color="primary">
                            <HomeRoundedIcon />
                        </IconButton>
                    </Link>
                </li>
                <li>
                    <SignOutButton />
                </li>
            </ul>
        </nav>
    );
};
