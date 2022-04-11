// Protected File. SPoC - V Vinay Kumar
import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";

class ErrorBoundary extends Component {
    state = {
        hasError: false,
    };

    componentDidCatch(error, info) {
        this.setState((state) => ({ ...state, hasError: true }));
    }
    componentDidUpdate(prevProps) {
        if (prevProps.location && this.props.location) {
            if (prevProps.location.pathname !== this.props.location.pathname) {
                this.setState({ hasError: false });
            }
        }
    }

    render() {
        const { t } = this.props; 
        if (this.state.hasError) {
            return (
                <div className="text-center">
                    <h2 className="mt-5 mb-4">{t(this.props.language?.layout?.somethingwrong)}</h2>
                    <button className="btn btn-primary rounded" onClick={(e) => (window.location.href = "/")}>
                    {t(this.props.language?.layout?.tohome)}
                    </button>
                </div>
            );
        } else {
            return this.props.children;
        }
    }
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, {})(withTranslation()(ErrorBoundary));

