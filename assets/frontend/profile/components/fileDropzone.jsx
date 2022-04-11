import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
class FileDropZone extends Component {
    constructor() {
        super();
        this.state = {
            files: [],
            filename: "",
        };
    }

    isValidFileType = (fName) => {
        let extensionLists = ["pdf", "doc", "docx"];
        return extensionLists.indexOf(fName.split(".").pop()) > -1;
    };

    fileupload = (files) => {
        if (files[0].size > 2000000) {
            toast.error(this.props.t(this.props.language?.layout?.toast42_nt));
            return;
        }
        if (!this.isValidFileType(files[0].name)) {
            toast.error(this.props.t(this.props.language?.layout?.toast43_nt));
            return;
        } else {
            this.setState({ filename: files[0].name });
            this.props.filesdata(files);
        }
    };

    render() {
        const { t } = this.props;
        var name = "";
        const files = this.state.files.map((file) => (
            <li key={file.name}>
                {file.name} - {file.size} bytes
            </li>
        ));


        // console.log(this.state.files)
        return (
            <Dropzone
                onDrop={this.fileupload}
            >
                {({ getRootProps, getInputProps }) => (
                    <section className="dropZone container text-center">
                        <div {...getRootProps({ className: "dropzone pt-3 border" })}>
                            <input {...getInputProps()} />
                            <p>
                                {this.state.filename
                                    ? this.state.filename
                                    : (
                                        <div className='row'>
                                            <div className="col-md-3">
                                                <img src="/svgs/icons_new/uploadBox.svg" class="" alt="upload" width="100%" />
                                            </div>
                                            <div className="col-md-9">
                                                <div className="float-left">
                                                    <h5 className="float-left mb-0">{t(this.props.language?.layout?.profile_dropresume_nt)}</h5> 
                                                    <p className="float-left"> {t(this.props.language?.layout?.profile_dropresume_info_nt)}</p> 
                                                    <button type="button" class="btn btn-secondary float-left rounded btn-sm">{t(this.props.language?.layout?.profile_browse_nt)}</button> 
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </p>
                        </div>
                        <aside>
                            <ul>{files}</ul>
                        </aside>
                    </section>
                )
                }
            </Dropzone>
        );
    }
}


function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(withTranslation()(FileDropZone));