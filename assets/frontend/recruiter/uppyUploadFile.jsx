import React, { useState, useEffect, Fragment } from "react";

import { Dashboard } from "@uppy/react";
const Uppy = require("@uppy/core");
const Webcam = require("@uppy/webcam");

const UppyUploadFiles =()=> {
    const uppy = React.useMemo(() => {
        allowedFileTypes: ".png";
        return Uppy().use(Webcam);
    }, []);
    useEffect(() => {
        return () => uppy.close();
    }, []);
    return(
        <div>
            <Dashboard uppy={uppy} hideUploadButton={true} allowedFileTypes={["image/*"]} height="150px" />
        </div>
    )
}
export default UppyUploadFiles