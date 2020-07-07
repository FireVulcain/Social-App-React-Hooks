import React, { useState, useEffect } from "react";
import { withFirebase } from "../config/Firebase/context";

const Test = ({ firebase }) => {
    const [test, setTest] = useState([]);
    const { firestore } = firebase;

    useEffect(() => {
        const getTest = async () => {
            const result = await firestore.collection("test").get();

            result.forEach((t) => {
                console.log(t.data());
                setTest((prevArray) => [...prevArray, t.data()]);
            });
        };

        getTest();
    }, [firestore]);

    console.log(test);
    return <div></div>;
};

export default withFirebase(Test);
