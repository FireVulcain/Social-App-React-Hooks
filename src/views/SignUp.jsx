import React, { useEffect, useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";

/* Components */
import SignUpForm from "./../components/auth/SignUpForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

/* Routes */
import * as ROUTES from "./../constants/routes";

/* Context */
import { GlobalContext } from "./../config/GlobalState/GlobalState";

export const SignUp = () => {
    const { state } = useContext(GlobalContext);
    const [redirect, setRedirect] = useState(null);

    const {
        user: { authenticated, loading },
    } = state;

    useEffect(() => {
        authenticated ? setRedirect(true) : setRedirect(false);
    }, [authenticated]);

    return (
        <>
            {!loading ? (
                redirect ? (
                    <Redirect to="/" />
                ) : (
                    <Box className="form-container">
                        <Typography variant="h4" component="h1">
                            Create an account
                        </Typography>
                        <SignUpForm />
                        <Link to={ROUTES.SIGN_IN} className="form-link">
                            <Typography variant="body1" component="span">
                                Log In
                            </Typography>
                        </Link>
                    </Box>
                )
            ) : (
                <Box display="flex" justifyContent="center">
                    <CircularProgress size={50} />
                </Box>
            )}
        </>
    );
};
