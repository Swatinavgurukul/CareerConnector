import { combineReducers } from "redux";
import { getUnixTime } from "../modules/helpers.jsx";
import { toast } from "react-toastify";

const initState = {
    user: { authenticated: false, name: "", chat_id: "", is_user: true, user_id: null, role_id: null, is_consent: null, tenant_name: null, user_image: null, is_cananda: false },
    userToken: null,
    refreshToken: null,
    expires_at: null,
    language: {},
    languageName: "en",
    billing: "",
    compareApplicants: [],
    advanceSearchData: { advanceSearchResults: [], searchName: "" },
    messageCount: 0,
    multiresumeToken: null,
    multiJobUploadToken: null,
    tenantTheme: {},
    profileImage: null,
    canadaPath: null,
    changeCountry: "",
    theme: {
        sidebar_background: {
            backgroundColor: "#252531",
            "&:hover": {
                backgroundColor: "#55556D",
            },
        },
        sidebar_heading: {
            color: "white",
            "&:hover ": {
                backgroundColor: "#55556D",
            },
        },
        brand_color: {
            backgroundColor: "#00ADEF",
        },
        header_background: {
            backgroundColor: "#F2F2F2",
        },
        tableHeader_background: {
            backgroundColor: "#2F2F2F",
        },
        all_color: {
            backgroundColor: "#D6F3FF",
        },
        active_color: {
            backgroundColor: "#BEFFCE",
        },
        closed_color: {
            backgroundColor: "#FFDEE1",
        },
        paused_color: {
            backgroundColor: "#FFF1D5",
        },
        offer_color: {
            backgroundColor: "#E6D9FF",
        },
        screening_color: {
            backgroundColor: "#f26a0a47",
        },
        interview_color: {
            backgroundColor: "#d53e9247",
        },
    },
};

const userDetailsReducer = (state = initState, action) => {
    switch (action.type) {
        case "set_auth_data":
            return {
                ...state,
                user: action.payload.user,
                userToken: action.payload.userToken,
                refreshToken: action.payload.refreshToken,
                expires_at: action.payload.expires_at,
            };
        case "checkLogin":
            let valid_token = state.userToken && state.expires_at > getUnixTime();
            if (state.userToken !== null && !valid_token) {
                toast.error("Session Expired! Please Login Again");
                return initState;
            } else {
                return state;
            }
        case "languages":
            return {
                ...state,
                language: action.payload.language,
            };
        case "language_name":
            return {
                ...state,
                languageName: action.payload.languageName,
            };
        case "billing_auth":
            return {
                ...state,
                billing: action.payload.billing,

            };
        case "compare_Applicants":
            return {
                ...state,
                compareApplicants: action.payload.compareApplicants,

            };
        case "messageCount_auth":
            return {
                ...state,
                messageCount: action.payload.messageCount,
            };
        case "advanceSearch_Data":
            return {
                ...state,
                advanceSearchData: action.payload.advanceSearchData,
            };

        case "multiresume_Token":
            return {
                ...state,
                multiresumeToken: action.payload.multiresumeToken,
            };
        case "multijobupload_Token":
            return {
                ...state,
                multiJobUploadToken: action.payload.multiJobUploadToken,
            };
        case "user_Image":
            return {
                ...state,
                profileImage: action.payload.profileImage,
            };
        case "tenant_theme":
            return {
                ...state,
                tenantTheme: action.payload.tenantTheme,
            };
        case "canada_Path":
            return {
                ...state,
                canadaPath: action.payload.canadaPath,
            };
        case "change_country":
            return {
                ...state,
                changeCountry: action.payload.changeCountry,
            };
        case "logout":
            return initState;
        case "clearStoreOnEvent":
            return {
                ...state,
                user: initState.user,
                userToken: null,
                refreshToken: null,
                expires_at: null,
                billing: "",
                compareApplicants: initState.compareApplicants,
                advanceSearchData: initState.advanceSearchData,
                messageCount: initState.messageCount,
                multiresumeToken: initState.multiresumeToken,
                multiJobUploadToken: initState.multiJobUploadToken,
                changeCountry: initState.changeCountry
            }
        case "set_defaults":
            return initState;
        default:
            return state;
    }
};
const themeReducer = (state = initState, action) => {
    switch (action.type) {
        case "theme":
            return initState;
        default:
            return state;
    }
};

export default combineReducers({
    authInfo: userDetailsReducer,
    themeInfo: themeReducer,
});
