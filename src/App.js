import React from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";

/* components */
import Home from "./views/Home";
import { Post } from "./views/Post";
import { User } from "./views/User";
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
        <Router>
            <GlobalProvider>
                <Navigation />
                <Container maxWidth="lg">
                    <Switch>
                        <Route exact path={ROUTES.HOME} component={Home} />
                        <Route exact path={ROUTES.SIGN_UP} component={SignUp} />
                        <Route exact path={ROUTES.SIGN_IN} component={SignIn} />
                        <Route exact path={ROUTES.USER} component={User} />
                        <Route exact path={ROUTES.POST} component={Post} />
                        <Route render={() => <Redirect to="/" />} />
                    </Switch>
                </Container>
            </GlobalProvider>
        </Router>
    );
};

export default withAuthentication(App);
