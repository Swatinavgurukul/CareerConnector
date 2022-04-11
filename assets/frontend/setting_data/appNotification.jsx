import React, { Component } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslation } from 'react-i18next';

class AppNotification extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notify_primary_email: false,
            notify_secondary_email: false,
            notify_phone: false,
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        Axios.get("/api/v1/profilesetting", {
            headers: { Authorization: `Bearer ${this.props.userToken}` },
        })
            .then((response) => {
                // console.log("Notification response", response.data.data)
                let incoming_data = response.data.data;
                this.setState({ ...incoming_data.app_notifications });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    handleprimaryEmailStatus = (event) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                notify_primary_email: !prevState.notify_primary_email,
            };
        });
    };

    handleSecondaryEmailStatus = (event) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                notify_secondary_email: !prevState.notify_secondary_email,
            };
        });
    };

    handleMobileSmsStatus = (event) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                notify_phone: !prevState.notify_phone,
            };
        });
    };

    handlePasswordReset = (e, id) => {
        let temp = {};
        temp.notify_primary_email = this.state.notify_primary_email;
        temp.notify_secondary_email = this.state.notify_secondary_email;
        temp.notify_phone = this.state.notify_phone;

        const endpoint = `/api/v1/profilesetting/${id}`;
        Axios.put(endpoint, JSON.stringify({ app_notifications: temp }), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.props.userToken}`,
            },
        })
            .then((response) => {
                // console.log(response);
                if (response.status == 200) {
                    toast.success(this.props.t(this.props.language?.layout?.toast89_nt), {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        const { t } = this.props;
        return (
            <div className="card border-0 pt-3 rounded-0" id="Notifications_settings">
                <div className="card-body p-0 pb-5">
                    <p>{t(this.props.language?.layout?.js_notifications_enablenotifications)}</p>
                    <form className="d-flex flex-row text-muted pt-2">
                        <div className="form-check custom-checkbox mr-4 pl-1 pt-1">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="defaultCheck2"
                                value={this.state.notify_primary_email}
                                checked={this.state.notify_primary_email}
                                onChange={this.handleprimaryEmailStatus}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="defaultCheck2"
                                tabIndex="0"
                                onKeyDown={e => e.key === "Enter" && this.handleprimaryEmailStatus(e)}>
                            </label>
                            <span className="custom-checkbox-text mr-4">{t(this.props.language?.layout?.js_notifications_primaryemail)}</span>
                        </div>
                        <div className="form-check custom-checkbox mr-4 pl-1 pt-1">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="defaultCheck01"
                                value={this.state.notify_secondary_email}
                                checked={this.state.notify_secondary_email}
                                onChange={this.handleSecondaryEmailStatus}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="defaultCheck01"
                                tabIndex="0"
                                onKeyDown={e => e.key === "Enter" && this.handleSecondaryEmailStatus(e)}>
                            </label>
                            <span className="custom-checkbox-text stretched-link mr-4">{t(this.props.language?.layout?.js_notifications_secondaryemail)}</span>
                        </div>
                        {/* <div className="form-check custom-checkbox border border-dark pl-1 pt-1">
                     <span className="custom-checkbox-text stretched-link mr-4">Mobile SMS</span>
                     <input className="form-check-input"
                      type="checkbox"
                      id="defaultCheck02"
                      value={this.state.notify_phone}
                      checked={this.state.notify_phone}
                      onChange={this.handleMobileSmsStatus}
                      />
                     <label className="form-check-label" htmlFor="defaultCheck02"></label>
                  </div> */}
                    </form>
                </div>

                <div className="d-md-flex p-0">
                    <div className="col-12 text-right p-0 mt-3">
                        <button
                            className="btn btn-outline-secondary btn-md px-4 px-md-5 mx-4"
                            onClick={() => { window.location.href = "/" }}>
                            {t(this.props.language?.layout?.js_notifications_cancel)}
                        </button>
                        <button
                            className="btn btn-primary btn-md px-4"
                            onClick={(e) => this.handlePasswordReset(e, this.state.id)}>
                            {t(this.props.language?.layout?.js_notifications_savechanges)}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(AppNotification));
