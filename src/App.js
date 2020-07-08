import React from "react";
import "./App.css";

/* components */
import { Home } from "./views/Home";

/* context */
import { GlobalProvider } from "./context/GlobalState";

/* Material UI*/
import Container from "@material-ui/core/Container";

function App() {
    return (
        <GlobalProvider>
            <Container maxWidth="lg">
                <Home />
            </Container>
        </GlobalProvider>
    );
}

export default App;
