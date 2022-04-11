import React from "react";

// Capture 404 error in Rollbar
const spinner = () => {
    return (
        <div>
            {/*<h5 className="loading-text">Please be patient while we fetch some interesting jobs for you! </h5>*/}
            <div className="text-center">
                <img src="/images/loading.gif" className="loading-image" title="loader" />
            </div>
        </div>
    );
};

export default spinner;
