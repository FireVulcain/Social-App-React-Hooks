import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

//context
import { withFirebase } from "../../config/Firebase/context";

/* Material UI */
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const INITIAL_STATE = {
    email: "",
    password: "",
    error: null,
};

const SignInForm = ({ firebase }) => {
    const [signInState, setSignInState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = signInState;

        setLoading(true);

        try {
            await firebase.doSignInWithEmailAndPassword(email, password);
            setSignInState({ ...INITIAL_STATE });
            setLoading(false);
        } catch (error) {
            setSignInState((prevState) => ({ ...prevState, error }));
        }
    };

    const onChange = (event) => {
        setSignInState({ ...signInState, [event.target.name]: event.target.value });
    };

    const isInvalid = signInState.password === "" || signInState.email === "";
    return (
        <form onSubmit={onSubmit}>
            <TextField
                className="form-input-container"
                name="email"
                value={signInState.email}
                onChange={onChange}
                type="text"
                label="Email Address"
            />
            <TextField
                className="form-input-container"
                name="password"
                value={signInState.password}
                onChange={onChange}
                type="password"
                label="Password"
            />
            <Button className="form-button" type="submit" variant="contained" disabled={isInvalid}>
                {!loading ? "Log In" : <CircularProgress size={30} />}
            </Button>

            {signInState.error && (
                <Typography variant="body2" className="form-error">
                    {signInState.error.message}
                </Typography>
            )}
        </form>
    );
};

export default compose(withRouter, withFirebase)(SignInForm);
