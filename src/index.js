import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./reset.css";

import Firebase, { FirebaseContext } from "./config/Firebase";

ReactDOM.render(
    <React.Fragment>
        <FirebaseContext.Provider value={new Firebase()}>
            <App />
        </FirebaseContext.Provider>
    </React.Fragment>,
    document.getElementById("root")
);
