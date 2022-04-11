import React, { Component, Fragment } from "react";
import ReactQuill from "react-quill";
const toolbarOptions = ["bold"];
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";

class Reactquill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
        };
    }

    modules = {

        // toolbar:
        //  [
        //     [{ header: [1, 2, false] }],
        //     ["bold", "italic", "underline", "strike", "blockquote"],
        //     [{ list: "ordered" }, { list: "bullet" }],
        //     ["link", "image"],
        // ]
        // ,
        keyboard: {
            bindings: {
                tab: {
                    key: 9,
                    handler: function () {
                        return true
                    }
                },
            }
        }
    };

    formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];

    render() {
        const { t } = this.props;
        return (
            <div className="bubble-border" role="link">
                <ReactQuill
                    theme="bubble"
                    modules={this.modules}
                    formats={this.formats}
                    value={this.props.value || ''}
                    onChange={(e) => this.props.onChange(e, this.props.param)}
                    placeholder= {t(this.props.language?.layout?.all_write_nt)}>
                </ReactQuill>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps)(withTranslation()(Reactquill));
