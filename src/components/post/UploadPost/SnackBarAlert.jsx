import React from "react";

/* Material UI */
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

export const SnackBarAlert = ({ tooManyFiles, setTooManyFiles }) => {
    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setTooManyFiles(false);
    };
    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };

    return (
        <Snackbar open={tooManyFiles} autoHideDuration={6000} onClose={handleCloseSnackBar}>
            <Alert onClose={handleCloseSnackBar} severity="error">
                No more than 4 photos
            </Alert>
        </Snackbar>
    );
};
