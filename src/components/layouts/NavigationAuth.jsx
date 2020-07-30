import React, { useContext } from "react";
import { Link } from "react-router-dom";

/* Constants */
import * as ROUTES from "./../../constants/routes";

/* Context */
import { GlobalContext } from "../../config/GlobalState/GlobalState";

/* Components */
import SignOutButton from "../auth/SignOut";
import Search from "./Search";

/* Material UI */
import IconButton from "@material-ui/core/IconButton";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import PersonIcon from "@material-ui/icons/Person";

export const NavigationAuth = () => {
    const { state } = useContext(GlobalContext);

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
                    <Link to={`/user/${state.user.credentials.userName}`}>
                        <IconButton color="primary">
                            <PersonIcon />
                        </IconButton>
                    </Link>
                </li>
                <li>
                    <SignOutButton />
                </li>
                <li>
                    <Search />
                </li>
            </ul>
        </nav>
    );
};
