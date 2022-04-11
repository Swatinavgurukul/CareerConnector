import React, { Component } from "react";
import { connect } from "react-redux";
import { Fragment } from "react";
import { withTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

class RowData extends Component {
    constructor(props) {
        super(props);
    }
    state = { expanded: false };

    render() {
        const { t } = this.props;
        const { user, actionsToPerform, theme, downloadReport } = this.props;
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <p
                className="text-dark"
                href=""
                ref={ref}
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}>
                {children}
            </p>
        ));

        return [
            <Fragment>
                <tr key="main">
                    <td className="pl-3 align-middle text-capitalize">{user.name.split("-")[0]}</td>
                    <td className="pl-3 align-middle text-capitalize">Employer Partner</td>
                    <td className="pl-3 align-middle text-capitalize">{user.is_active ? "active" : "InActive"}</td>
                    <td className="pl-3 align-middle text-capitalize">{user.counts[0].sent_out}</td>
                    <td className="pl-3 align-middle text-capitalize">{user.counts[0].responses}</td>
                    <td className="pl-3 align-middle text-capitalize">
                        <Link
                            aria-describedby="Survey Reports"
                            className="btn btn-sm btn-outline-secondary disabled"
                            to={{
                                pathname: "/surveyReports",
                                state: {
                                    id: user.id,
                                },
                            }}>
                            View Summary</Link></td>
                    <td className="pl-3 align-middle text-capitalize">
                        <button className="btn btn-sm btn-outline-secondary" onClick={(e) => downloadReport(user.id, user.name.split("-")[0])}>Download <img
                            src="/svgs/icons_new/download.svg"
                            alt="download"
                            className="svg-xs mr-1"
                        /></button></td>
                </tr>
            </Fragment>
        ];
    }
}
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userRole: state.authInfo.user,
        language: state.authInfo.language,
    };
}

export default connect(mapStateToProps, {})(withTranslation()(RowData));
