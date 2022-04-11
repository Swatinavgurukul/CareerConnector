import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoute = (props) => {
    const { component: Component, role: User, ...rest } = props;
    const { user } = props;
    const bill = props.billing;
    var role = "";
    if (user.authenticated !== false) {
        role = user.is_user === true ? "user" : "admin";
    }
    return (
        <Route
            {...rest}
            render={(props) =>
                user.authenticated ? (
                    role === User ? (
                        user.role_id === 1 ? (
                            bill == true ? (
                                <Component {...props} />
                            ) : (
                                <Redirect to="/onboarding" />
                            )
                        ) : (
                            <Component {...props} />
                        )
                    ) : User === "all" ? (
                        user.role_id === 1 ? (
                            bill == true ? (
                                <Component {...props} />
                            ) : (
                                <Redirect to="/onboarding" />
                            )
                        ) : (
                            <Component {...props} />
                        )
                    ) : (
                        <Redirect to="/404" />
                    )
                ) : (
                    <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location.pathname }
                    }}
                    />
                )
            }
        />
    );
};
function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        user: state.authInfo.user,
        billing: state.authInfo.billing,
    };
}

export default connect(mapStateToProps, {})(PrivateRoute);
