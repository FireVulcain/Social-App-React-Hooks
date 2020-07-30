import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "./../../helper/function";

/* Context */
import { withFirebase } from "./../../config/Firebase/context";

/* Material UI */

import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";

import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";

const Search = ({ firebase }) => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [isFocus, setIsFocus] = useState(false);

    const debouncedSearchTerm = useDebounce(search, 500);

    const wrapperRef = useRef(null);

    useEffect(() => {
        const searchUser = async () => {
            const searchUserName = search.toLowerCase();
            const userResult = [];

            const resultUser = await firebase.firestore
                .collection("users")
                .orderBy("userName_lowercase")
                .startAt(searchUserName)
                .endAt(searchUserName + "\uf8ff")
                .get();

            resultUser.forEach((res) => {
                userResult.push(res.data());
            });

            setSearchResult(userResult);
        };
        if (search) {
            searchUser();
        } else {
            setSearchResult([]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm]);

    useEffect(() => {
        document.addEventListener("mousedown", handleFocus, false);

        return () => {
            document.removeEventListener("mousedown", handleFocus, false);
        };
    });

    const handleFocus = (e) => {
        if (!wrapperRef.current.contains(e.target)) return setIsFocus(false);
    };

    const handleClickUser = () => {
        setSearch("");
        setSearchResult([]);
    };

    return (
        <div className="search-user-container" ref={wrapperRef}>
            <TextField
                className={`search-input ${isFocus ? "search-input-focused" : ""}`}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                onFocus={() => setIsFocus(true)}
                placeholder="Search a user"
            />
            {search ? (
                <IconButton className="search-delete-search" onClick={() => setSearch("")}>
                    <CancelIcon />
                </IconButton>
            ) : null}
            {searchResult.length > 0 && isFocus ? (
                <div className="search-user-result">
                    {searchResult.map((user, key) => {
                        return (
                            <Link to={`/user/${user.userName}`} onClick={() => handleClickUser()} key={key}>
                                <Box className="search-user-info" display="flex" alignItems="center">
                                    <img src={user.userImage} alt={user.userName} />
                                    <div>
                                        <Typography className="user-displayedName">{user.displayedName}</Typography>
                                        <Typography className="user-userName">@{user.userName}</Typography>
                                    </div>
                                </Box>
                            </Link>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};
export default withFirebase(Search);
