import React from "react";
import Job from "./index.jsx";
const EditJob = (props) => {
    return <Job slug={props.location && props.location.state && props.location.state.slug} editJobIs={true} />;
};
export default EditJob;
