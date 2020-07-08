import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";

/* components */
import Home from "./views/Home";
import Navigation from "./components/layouts/Navigation";
import { SignUp } from "./views/SignUp";
import SignIn from "./views/SignIn";

/* context */
import GlobalProvider from "./config/GlobalState/GlobalState";
import { withAuthentication } from "./config/Session";

/* Material UI*/
import Container from "@material-ui/core/Container";

/* routes */
import * as ROUTES from "./constants/routes";

const App = () => {
    return (
        <GlobalProvider>
            <Router>
                <Navigation />
                <Container maxWidth="lg">
                    <Route exact path={ROUTES.HOME} component={Home} />
                    <Route path={ROUTES.SIGN_UP} component={SignUp} />
                    <Route path={ROUTES.SIGN_IN} component={SignIn} />
                </Container>
            </Router>
        </GlobalProvider>
    );
};

export default withAuthentication(App);
