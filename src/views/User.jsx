import React from "react";

export const User = (props) => {
    const userName = props.match.params.userName;
    return <div>User Page : {userName}</div>;
};
