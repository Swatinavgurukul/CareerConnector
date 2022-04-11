import React, { useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { _logout } from "../actions/actionsAuth.jsx";
import { _setAuthData } from "../actions/actionsAuth.jsx";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router";
import { toast } from "react-toastify";

const getUsers = (props) => {
    const [user, setUser] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [buttonDisable, setDisable] = useState(false);
    const history = useHistory();
    const [filter, setFilter] = useState("");
    const [isToggled, setToggled] = useState(false);
    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = () => {
        axios
            .get("api/v1/get_users", {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            })
            .then((response) => {
                setUser(response.data == null ? "" : response.data);
            })
            .catch((error) => {
                toast.error(error);
            });
    };

    const impersonateUser = () => {
        setDisable(true);

        axios
            .get(`api/v1/impersonate?user_id=${userEmail}`, {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                let decoded = jwt_decode(response.data.access_token);
                localStorage.setItem("access_token", response.data.access_token);
                let user_object = {
                    authenticated: true,
                    user_id: response.data.user_id,
                    is_user: response.data.is_user,
                    // is_user: false;
                    name: response.data.full_name,
                    role_id: response.data.role_id,
                    tenant_name: response.data.tenant_name,
                };
                props._setAuthData(
                    user_object,
                    response.data.access_token,
                    response.data.refresh_token,
                    decoded.exp - 600
                );
                history.push("/homepage");
                setFilter("");
            })
            .catch((error) => {
                setDisable(false);
                toast.error(error);
            });
    };

    const inputClick = (e) => {
        setFilter(e.target.value);
        setToggled(true);
    };
    const emailClick = (email, id) => {
        setUserEmail(id);
        setFilter(email);
        setToggled(false);
    };
    const handleEnter = (e) => {
        if (e.code === "Enter") {
            setToggled(!isToggled);
        }
    };
    const handleEmailEnter = (event, email, id) => {
        if (event.code === "Enter") {
            emailClick(email, id);
        }
    };

    return (
        <div className="d-flex mx-auto mt-5" role="form">
            <div className="form-group">
                <input
                    aria-label="User"
                    className="form-control"
                    placeholder="Select User"
                    value={filter}
                    onChange={inputClick}
                    onClick={() => setToggled(!isToggled)}
                    onKeyPress={handleEnter}
                    size="60"
                />
                {isToggled && user.length ? (
                    <div
                        className={`card elevation-2 border-0 candidate d-block ${
                            user.length >= 2 ? "thin-scrollbar" : ""
                        }`}>
                        {user.map((_user) => (
                            <div>
                                {_user.email.toLowerCase().includes(filter.toLowerCase()) ? (
                                    <div
                                        className="pl-3"
                                        id={_user.id}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => emailClick(_user.email, _user.id)}
                                        onKeyPress={(e) => handleEmailEnter(e, _user.email, _user.id)}
                                        tabIndex="0">
                                        {_user.email}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    ""
                )}
            </div>
            <div>
                {userEmail == "" ? (
                    ""
                ) : (
                    <div className="ml-3">
                        <button className="btn btn-primary" onClick={impersonateUser} disabled={buttonDisable}>
                            Impersonate
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
    };
}
export default connect(mapStateToProps, { _setAuthData })(getUsers);
