import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, auth, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                auth ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: `/login`,
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
};

export const GuestRoute = ({ component: Component, auth, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                auth ? (
                    <Redirect
                        to={{
                            pathname: `/home`,
                            state: { from: props.location },
                        }}
                    />
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

export const PublicRoute = ({ component: Component, auth, ...rest }) => {
    return <Route {...rest} render={(props) => <Component {...props} />} />;
};