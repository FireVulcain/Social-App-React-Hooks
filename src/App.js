import React from "react";
import "./App.css";

/* components */
import Posts from "./components/post/Posts";

/* context */
import { GlobalProvider } from "./context/GlobalState";

function App() {
    return (
        <GlobalProvider>
            <div className="container">
                <Posts />
            </div>
        </GlobalProvider>
    );
}

export default App;
