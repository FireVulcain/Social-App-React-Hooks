import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

/* Context */
import { withFirebase } from "./../../config/Firebase/context";

/* Material UI */
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import LinkIcon from "@material-ui/icons/Link";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const Banner = ({ firebase, userName }) => {
    const [user, setUser] = useState({});
    useEffect(() => {
        const getUser = async () => {
            const result = await firebase.firestore.collection("users").doc(userName);

            result.onSnapshot((querySnapshot) => {
                setUser(querySnapshot.data());
            });
        };

        getUser();
    }, [userName, firebase.firestore]);
    return (
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
    );
};

export default withFirebase(Banner);
