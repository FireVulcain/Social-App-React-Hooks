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
import Button from "@material-ui/core/Button";

/* Material UI Icons*/
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import LinkIcon from "@material-ui/icons/Link";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EditProfile from "./EditProfile";

const Banner = ({ firebase, userName, loggedUser, history }) => {
    const [user, setUser] = useState({});
    const [isUserProfile, setIsUserProfile] = useState(false);
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        const result = firebase.firestore
            .collection("users")
            .doc(userName)
            .onSnapshot((querySnapshot) => {
                if (!querySnapshot.exists) return history.push(ROUTES.HOME);
                setUser(querySnapshot.data());
            });

        return () => {
            result();
        };
    }, [userName, history, firebase.firestore]);

    useEffect(() => {
        if (userName === loggedUser) return setIsUserProfile(true);
    }, [loggedUser, userName]);

    return (
        <>
            {Object.keys(user).length === 0 && user.constructor === Object ? (
                <Box display="flex" justifyContent="center">
                    <CircularProgress size={30} />
                </Box>
            ) : (
                <div className="user-banner">
                    <div
                        className="banner-img"
                        style={{
                            backgroundImage: `url(${user.userBanner})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                        }}
                    ></div>
                    <div className="banner-info">
                        <div className="banner-profile-pic-container">
                            <div
                                style={{
                                    backgroundImage: `url(${user.userImage})`,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                }}
                            ></div>
                            <img src={user.userImage} alt={`${user.userName}`} />
                        </div>
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
                        {isUserProfile ? (
                            <>
                                <Button onClick={() => setOpen(true)} variant="contained" className="edit-profile-button">
                                    Edit profile
                                </Button>
                                <EditProfile open={open} handleClose={handleClose} user={user} firebase={firebase} />
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </>
    );
};

export default compose(withRouter, withFirebase)(Banner);
