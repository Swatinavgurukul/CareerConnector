import React, { useState, useEffect } from "react";
import { Dashboard } from "@uppy/react";
const Uppy = require("@uppy/core");
const Webcam = require("@uppy/webcam");

const UppyUpload = (props) => {
    React.useMemo(() => {
        return Uppy({
            debug: true,
            autoProceed: false,
            allowMultipleUploads: props.allowMultipleUploads,
            restrictions: {
                // maxFileSize: 300000,
                maxNumberOfFiles: props.maxFiles,
                // minNumberOfFiles: props.minFiles,
                allowedFileTypes: props.allowedFileType,
            },
        }).use(Webcam);
        // .use(Webcam, { id: "MyWebcam" })
    }, []);
    React.useEffect(() => {
        return () => uppy.close();
    }, []);

    const checkExtension = (filetype, data) => {
        Object.values(data)
            .filter((y) => y.extension !== filetype)
            .map((x) => {
                uppy.removeFile(x.id);
            });
    };

    useEffect(() => {
        console.log(" came in useeffe")
        uppy.upload();
        uppy.on("complete", (result) => {
            console.log(result, "Upload complete! We’ve uploaded these files:", result);

            // checkExtension(result.successful[0].extension, result.successful);
            props.onBlukUpload(result.successful.successful);

        });
    }, [uppy,uppy.upload()]);
    return (
        <Dashboard
            uppy={uppy}
            hideUploadButton={props.hideUploadButton}
            width={props.width}
            height={props.height}
        />
    );
};

export default UppyUpload;
