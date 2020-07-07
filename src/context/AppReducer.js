export default (state, action) => {
    switch (action.type) {
        case "SET_POSTS":
            return {
                ...state,
                data: {
                    ...state.data,
                    posts: [...state.data.posts, action.payload],
                },
            };
        default:
            return state;
    }
};
