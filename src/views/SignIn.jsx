import React, { useEffect, useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";

/* Components */
import SignInForm from "./../components/auth/SignInForm";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

/* Routes */
import * as ROUTES from "./../constants/routes";

/* Context */
import { GlobalContext } from "./../config/GlobalState/GlobalState";

const SignIn = () => {
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
                            Log in
                        </Typography>
                        <SignInForm />
                        <Link to={ROUTES.SIGN_UP} className="form-link">
                            <Typography variant="body1" component="span">
                                Sign Up
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

export default SignIn;
