import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";

//context
import { withFirebase } from "../../config/Firebase/context";

/* Components */
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

/* Routes */
import * as ROUTES from "./../../constants/routes";

const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
    error: null,
};

const SignUpForm = ({ firebase, history }) => {
    const [signUpState, setSignUpState] = useState(INITIAL_STATE);

    const onSubmit = (event) => {
        event.preventDefault();
        const { username, email, passwordOne } = signUpState;

        firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then((authUser) => {
                uploadUser(email, username, authUser.user.uid);

                setSignUpState({ ...INITIAL_STATE });
                history.push(ROUTES.HOME);
            })
            .catch((error) => {
                setSignUpState((prevState) => ({ ...prevState, error }));
            });
    };

    const uploadUser = async (email, userName, userId) => {
        await firebase.firestore
            .collection("users")
            .doc()
            .set({
                bio: "",
                createdAt: new Date().toISOString(),
                email,
                userName,
                userImage: `https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_STORAGE_BUCKET}/o/no-img.png?alt=media`,
                location: "",
                userId,
                website: "",
            });
    };

    const onChange = (event) => {
        setSignUpState({ ...signUpState, [event.target.name]: event.target.value });
    };

    const isInvalid =
        signUpState.passwordOne !== signUpState.passwordTwo ||
        signUpState.passwordOne === "" ||
        signUpState.email === "" ||
        signUpState.username === "";

    return (
        <form onSubmit={onSubmit}>
            <TextField
                className="form-input-container"
                name="username"
                value={signUpState.username}
                onChange={onChange}
                type="text"
                label="Full Name"
            />
            <TextField
                className="form-input-container"
                name="email"
                value={signUpState.email}
                onChange={onChange}
                type="text"
                label="Email Address"
            />
            <TextField
                className="form-input-container"
                name="passwordOne"
                value={signUpState.passwordOne}
                onChange={onChange}
                type="password"
                label="Password"
            />
            <TextField
                className="form-input-container"
                name="passwordTwo"
                value={signUpState.passwordTwo}
                onChange={onChange}
                type="password"
                label="Confirm Password"
            />
            <Button className="form-button" type="submit" variant="contained" disabled={isInvalid}>
                Sign Up
            </Button>

            {signUpState.error && (
                <Typography variant="body2" className="form-error">
                    {signUpState.error.message}
                </Typography>
            )}
        </form>
    );
};

export default compose(withRouter, withFirebase)(SignUpForm);
