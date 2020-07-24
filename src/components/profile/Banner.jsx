import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import dayjs from "dayjs";
import { compose } from "recompose";

/* Constants */
import * as ROUTES from "./../../constants/routes";

/* Context */
import { withFirebase } from "./../../config/Firebase/context";

/* Material UI */
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import LinkIcon from "@material-ui/icons/Link";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const Banner = ({ firebase, userName, history }) => {
    const [user, setUser] = useState({});
    useEffect(() => {
        const getUser = async () => {
            const result = await firebase.firestore.collection("users").doc(userName);

            result.onSnapshot((querySnapshot) => {
                if (!querySnapshot.exists) return history.push(ROUTES.HOME);
                setUser(querySnapshot.data());
            });
        };

        getUser();
    }, [userName, firebase.firestore, history]);

    return (
        <>
            {Object.keys(user).length === 0 && user.constructor === Object ? (
                <Box display="flex" justifyContent="center">
                    <CircularProgress size={30} />
                </Box>
            ) : (
                <div className="user-banner">
                    <div className="banner-img" style={{ backgroundImage: `url(${user.userBanner})` }}></div>
                    <div className="banner-info">
                        <img src={user.userImage} alt={`${user.userName}`} />
                        <Typography variant="body2" className="user-displayedName">
                            {user.displayedName}
                        </Typography>
                        <Typography variant="body2" className="user-userName">
                            @{user.userName}
                        </Typography>
                        <Typography variant="body2" className="user-bio">
                            {user.bio}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                            <Typography variant="body2" className="user-location">
                                <LocationOnIcon /> {user.location}
                            </Typography>
                            <Typography variant="body2">
                                <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="user-website">
                                    <LinkIcon /> {user.website}
                                </a>
                            </Typography>
                            <Typography variant="body2" className="user-joined">
                                <CalendarTodayIcon fontSize="small" /> Joined {dayjs(user.createdAt).format("MMMM YYYY")}
                            </Typography>
                        </Box>
                    </div>
                </div>
            )}
        </>
    );
};

export default compose(withRouter, withFirebase)(Banner);
