export default (state, action) => {
    switch (action.type) {
        case "SET_POSTS":
            return {
                ...state,
                data: {
                    ...state.data,
                    post: {},
                    posts: action.payload,
                },
            };
        case "SET_POST":
            return {
                ...state,
                data: {
                    ...state.data,
                    post: action.payload,
                },
            };
        case "SET_USER":
            return {
                ...state,
                user: {
                    ...state.user,
                    authenticated: true,
                    credentials: { ...action.payload },
                    loading: false,
                },
            };
        case "SET_NOTIFICATION":
            return {
                ...state,
                user: {
                    ...state.user,
                    notifications: action.payload,
                },
            };
        case "LOGOUT_USER":
            return {
                ...state,
                data: {
                    posts: [],
                    post: { ...state.data.post },
                },
                user: {
                    authenticated: false,
                    credentials: {},
                    notifications: [],
                    likes: [],
                },
            };
        case "LIKE_POST":
            return {
                ...state,
                user: {
                    ...state.user,
                    likes: [...action.payload],
                },
            };
        default:
            return state;
    }
};
