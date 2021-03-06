import React, { useState } from "react";

//context
import { withFirebase } from "../../config/Firebase/context";

/* Material UI */
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const INITIAL_STATE = {
    username: "",
    email: "",
    passwordOne: "",
    passwordTwo: "",
    error: null,
};

const SignUpForm = ({ firebase }) => {
    const [signUpState, setSignUpState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        const { username, email, passwordOne } = signUpState;

        setLoading(true);

        // Check if user exist
        const snapshot = await firebase.firestore.collection("users").doc(`${username}`).get();

        // if snashop doesn't exist, we can create the user
        if (!snapshot.exists) {
            try {
                const authUser = await firebase.doCreateUserWithEmailAndPassword(email, passwordOne);
                await uploadUser(email, username, authUser.user.uid);
            } catch (error) {
                setLoading(false);
                setSignUpState((prevState) => ({ ...prevState, error }));
            }
        } else {
            setLoading(false);
            setSignUpState((prevState) => ({ ...prevState, error: { message: "Username already taken" } }));
        }
    };

    const uploadUser = async (email, userName, userId) => {
        let userName_lowercase = userName.toLowerCase();
        return await firebase.firestore
            .collection("users")
            .doc(userName)
            .set({
                bio: "",
                createdAt: new Date().toISOString(),
                email,
                userName,
                userName_lowercase,
                displayedName: userName,
                displayedName_lowercase: userName_lowercase,
                userImage: `https://firebasestorage.googleapis.com/v0/b/${process.env.REACT_APP_STORAGE_BUCKET}/o/no-img.png?alt=media`,
                userBanner: "",
                location: "",
                userId,
                website: "",
                followers: 0,
                following: 0,
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
                label="Username"
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
                {!loading ? "Sign Up" : <CircularProgress size={30} />}
            </Button>

            {signUpState.error && (
                <Typography variant="body2" className="form-error">
                    {signUpState.error.message}
                </Typography>
            )}
        </form>
    );
};

export default withFirebase(SignUpForm);
