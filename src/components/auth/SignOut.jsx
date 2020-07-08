import React from "react";

//context
import { withFirebase } from "../../config/Firebase/context";

const SignOut = ({ firebase }) => (
    <button type="button" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);

export default withFirebase(SignOut);
