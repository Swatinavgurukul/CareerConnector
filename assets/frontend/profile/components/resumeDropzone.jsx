import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

class resumeDropZone extends Component {
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
            <Dropzone onDrop={this.fileupload}
            // minSize={0}
            // maxSize={2097152}
            >
                {({ getRootProps, getInputProps }) => (
                    <section className="dropZone container text-center">
                        <div {...getRootProps({ className: "dropzone p-5 border" })}>
                            <input {...getInputProps()} />
                            <p>
                                {this.state.filename
                                    ? this.state.filename
                                    : (
                                        <div className='row'>
                                            <div className="col-md-12">
                                                <img src="/svgs/icons_new/uploadBox.svg" alt="upload" width="150px" />
                                                <div className="ml-2">
                                                    <span className="">
                                                        <h5 className="mb-0">{t(this.props.language?.layout?.dropfile_nt)}</h5> 
                                                        <p className=""> {t(this.props.language?.layout?.profile_dropresume_info_nt)}</p> 
                                                        <button type="button" class="btn btn-secondary rounded btn-sm">{t(this.props.language?.layout?.profile_browse_nt)}</button>
                                                    </span>
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
                )}
            </Dropzone>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(withTranslation()(resumeDropZone));
