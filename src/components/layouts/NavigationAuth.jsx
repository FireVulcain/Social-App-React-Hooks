import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

/* Constants */
import * as ROUTES from "./../../constants/routes";

/* Context */
import { GlobalContext } from "../../config/GlobalState/GlobalState";

/* Components */
import SignOutButton from "../auth/SignOut";
import Search from "./Search";

/* Material UI */
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";

import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import PersonIcon from "@material-ui/icons/Person";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

export const NavigationAuth = () => {
    const { state } = useContext(GlobalContext);
    const {
        user: { notifications },
    } = state;

    let notificationsIcon;
    if (notifications && notifications.length > 0) {
        notifications.filter((not) => not.read === false).length > 0
            ? (notificationsIcon = (
                  <Badge badgeContent={notifications.filter((not) => not.read === false).length} className="notification-badge">
                      <NotificationsIcon />
                  </Badge>
              ))
            : (notificationsIcon = <NotificationsIcon />);
    } else {
        notificationsIcon = <NotificationsIcon />;
    }

    return (
        <nav className="nav">
            <ul>
                <li>
                    <NavLink exact activeClassName="active-menu" to={ROUTES.HOME}>
                        <IconButton color="primary">
                            <HomeRoundedIcon />
                        </IconButton>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active-menu" to={`/user/${state.user.credentials.userName}`}>
                        <IconButton color="primary">
                            <PersonIcon />
                        </IconButton>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active-menu" to={ROUTES.NOTIFICATIONS}>
                        <IconButton color="primary">{notificationsIcon}</IconButton>
                    </NavLink>
                </li>
                <li>
                    <NavLink exact activeClassName="active-menu" to={ROUTES.MESSAGES}>
                        <IconButton color="primary">{<MailOutlineIcon />}</IconButton>
                    </NavLink>
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
