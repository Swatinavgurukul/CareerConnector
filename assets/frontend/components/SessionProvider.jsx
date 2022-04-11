// Protected File. SPoC - V Vinay Kumar
import React, { useState, useContext, createContext } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { getUnixTime } from "../modules/helpers.jsx";
import jwt_decode from "jwt-decode";

const sessionContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useSession().
export function SessionProvider({ children }) {
    const session = useSessionProvider();
    return <sessionContext.Provider value={session}>{children}</sessionContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useSession = () => {
    return useContext(sessionContext);
};

// Provider hook that creates auth object and handles state

function useSessionProvider() {
    const default_user_object = {
        authenticated: false,
        name: "",
        chat_id: "",
        is_user: true,
        user_id: null,
    };
    const [user, setUser] = useState(default_user_object);
    const [loading, setLoading] = useState(true);
    // const [authenticated, setAuthenticated] = useState(false);
    // const [userName, setUserName] = useState('');

    // Wrap any Firebase methods we want to use making sure ...
    // ... to save the user to state.
    const signIn = (username, password, verbose) => {
        return Axios.post("/api/v1/token", { username, password })
            .then((response) => {

                if (response.status === 200) {
                    let response_data = response.data;
                    updateUserFromToken(response_data.access, response_data.refresh);
                    // verbose == true ? (window.location.href = "/",) : response.status ;
                    if (verbose == true) {
                        window.location.href = "/search";
                        return ("login successfully done");
                    }
                    else {
                        return ("login successfully done");
                    }
                }
            })
            .catch((error) => {
                    // old one .............................
                        // if (error.response.data.detail !== undefined) {
                        //     console.log('inside',error.response.data.detail)
                        //     if (verbose == true) {
                        //         toast.error(error.response.data.detail);
                        //         window.location.href = "/";
                        //         return error.response.data.detail;
                        //     }
                        //     else {
                        //         return error.response.data.detail;
                        //     }
                        // }
                    // old one .............................
                    if(error.response.status === 400){
                        if (verbose == true) {
                            toast.error(error.response.data.non_field_errors[0]);
                            return error.response.data.non_field_errors[0];
                        }
                        else {
                            return error.response.data.non_field_errors[0];
                        }
                    }
                    if(error.response.status === 401){
                        if (verbose == true) {
                            toast.error(error.response.data.detail);
                            return error.response.data.detail;
                        }
                        else {
                            return error.response.data.detail;
                        }
                    }
            });
    };
    const signUp = (formData, verbose) => {
        return  Axios({
                    method: "post",
                    url: "/api/v1/register",
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then(function (response) {
                    if (response.data.status === 201) {

                        updateUserFromToken(response.data.data.access_token, response.data.data.refresh_token);
                         if (verbose == true) {
                            toast.success(response.data.message);
                            setTimeout(() => {
                                window.location.href = "/";
                            }, 5000);
                                return response.data.message;
                            }
                            else {
                                return response.data.message;
                            }
                    }
                    return;
                })
                .catch(function (error) {
                    // old one
                        // if (error.response !== undefined) {
                        //     toast.error(error.response.data.data.email[0]);
                        //     setTimeout(() => {
                        //         window.location.href = "/signUp";
                        //     }, 5000);
                        // }
                    // old one
                    if (error.response.status === 400) {
                        console.log('error.data.email[0]', error.response.data.data.email[0]);
                        if (verbose == true) {
                            toast.error(error.response.data.data.email[0]);
                            return error.response.data.data.email[0];
                        }
                        else {
                            return error.response.data.data.email[0];
                        }
                    }
                    else{
                        if (verbose == true) {
                            toast.error(error.response.data.data.email[0]);
                            return error.response.data.data.email[0];
                        }
                        else {
                            return error.response.data.data.email[0];
                        }
                    }

                });
        };
    const updateUserFromToken = (access_token, refresh_token) => {
        let decoded = jwt_decode(access_token);
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        // for profile we need User id. Can't get session in class component. Will remove.
        localStorage.setItem("user_id",decoded.user_id)
        // handle decode error
        localStorage.setItem("expires_at", decoded.exp - 600); // 600 = 10 mins leeway time
        let user_object = Object.assign({}, default_user_object, {
            authenticated: true,
            user_id: decoded.user_id,
            is_user: decoded.is_user,
            name: decoded.full_name,
        });
        setUser(user_object);
        // Save User Object in Localstorage
    };

    const signOut = () => {
        Axios.post(
            "/api/v1/logout",
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
        )
            .then((response) => {
                let response_data = response.data;
                clear();
                // setAuthenticated(false);
                if (localStorage.getItem("access_token") === null) {
                    window.location.href = "/";
                }
            })
            .catch((error) => {
                clear();
                // setAuthenticated(false);
                window.location.href = "/";
            });
    };

    const googleLogin = (accesstoken, expires_at) => {
        Axios.post("/api/v1/googlelogin", {
            access_token: accesstoken,
        })
            .then(function (response) {
                if (response.status === 200) {
                    localStorage.setItem("access_token", response.data.access_token);
                    localStorage.setItem("refresh_token", response.data.refresh_token);
                    localStorage.setItem("expires_at", expires_at);
                    localStorage.setItem("user_name", response.data.username);
                    // setAuthenticated(true);
                    window.location.href = "/";
                }
            })
            .catch(function (error) {});
    };
    const checkLogin = () => {
        let access_token = localStorage.getItem("access_token");
        let refresh_token = localStorage.getItem("refresh_token");
        let expires_at = localStorage.getItem("expires_at");
        let valid_token = access_token && expires_at > getUnixTime();
        if (valid_token) {
            updateUserFromToken(access_token, refresh_token);
        }

        if (access_token !== null && !valid_token) {
            clear();
            toast.error("Session Expired! Please Login Again");
        }
    };

    const clear = () => {
        localStorage.removeItem("user_name");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("user_id");
    };

    const isUser = () => {
        let token = localStorage.getItem("access_token");
        let decoded = jwt_decode(token);
        return decoded.is_user;
        // return false;
    };

    // Return the user object and auth methods
    return {
        isUser,
        user,
        signIn,
        signUp,
        signOut,
        loading,
        checkLogin,
        googleLogin,
    };
}
