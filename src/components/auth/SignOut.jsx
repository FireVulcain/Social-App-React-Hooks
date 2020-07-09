import React from "react";

//context
import { withFirebase } from "../../config/Firebase/context";

// Material ui
import IconButton from "@material-ui/core/IconButton";
import KeyboardReturnRoundedIcon from "@material-ui/icons/KeyboardReturnRounded";

const SignOut = ({ firebase }) => (
    <IconButton color="primary" onClick={firebase.doSignOut}>
        <KeyboardReturnRoundedIcon />
    </IconButton>
);

export default withFirebase(SignOut);
