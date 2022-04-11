import React, { Component } from "react";
import WorkItem from "./work_item.jsx";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";

//blog_link is used for twitter link

class SocialLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            social_links_modal: false,
            linkedin_link: "",
            facebook_link: "",
            blog_link: "",
        };
    }
    editSocailLinks = () => {
        this.setState({
            facebook_link: this.props.facebook_link,
            linkedin_link: this.props.linkedin_link === "" ? null : this.props.linkedin_link,
            blog_link: this.props.blog_link,
            social_links_modal: true,
        });
    };
    closeSocialLinksModal = () => {
        this.setState({ social_links_modal: false });
    };

    validateLinks = () => {
        console.log(this.state.blog_link);
        if (
            !/^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i.test(this.state.facebook_link) &&
            this.state.facebook_link !== null &&
            this.state.facebook_link !== ""
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast46_nt));
            return;
        }
        if (
            !/^(https?:\/\/)?((w{3}\.)?)linkedin.com\/.*/i.test(this.state.linkedin_link) &&
            this.state.linkedin_link !== null &&
            this.state.linkedin_link !== ""
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast47_nt));
            return;
        }
        if (
            !/^(https?:\/\/)?((w{3}\.)?)twitter.com\/.*/i.test(this.state.blog_link) &&
            this.state.blog_link !== null &&
            this.state.blog_link !== ""
        ) {
            toast.error(this.props.t(this.props.language?.layout?.toast48_nt));
            return;
        }
        this.updateSocialLinksToServer();
    };
    updateSocialLinksToServer = () => {
        const aboutme = Object.assign(
            {},
            {
                linkedin_link: this.state.linkedin_link,
                facebook_link: this.state.facebook_link,
                blog_link: this.state.blog_link,
            }
        );
        this.props.saveProfileDetails({ aboutme }, this.props.id);
        this.setState({ social_links_modal: false });
    };

    render() {
        const { t } = this.props;
        return (
            <div>
                <div className="text-center">
                    <p className="d-block mt-0 mb-2" style={{whiteSpace: "nowrap"}}> {t(this.props.language?.layout?.profile_connect_nt)}</p>
                    <div className="d-flex mb-2 justify-content-center">
                        <div tabIndex={0} onKeyDown={(e) => e.key == "Enter" && this.editSocailLinks()}
                            onClick={() => this.editSocailLinks()}
                            className={
                                this.props.facebook_link !== undefined &&
                                this.props.facebook_link !== null &&
                                this.props.facebook_link !== ""
                                    ? "mr-1 rounded-circle pointer svg-lg bg-white d-flex justify-content-center align-items-center"
                                    : "mr-1 svg-disabled rounded-circle pointer svg-lg bg-white d-flex justify-content-center align-items-center"
                            }>
                            <img src="/svgs/social/facebook.svg" className="svg-sm" title="Facebook" />
                        </div>
                        <div tabIndex={0} onKeyDown={(e) => e.key == "Enter" && this.editSocailLinks()}
                            onClick={() => this.editSocailLinks()}
                            className={
                                this.props.linkedin_link !== undefined &&
                                this.props.linkedin_link !== null &&
                                this.props.linkedin_link !== ""
                                    ? "mr-1 rounded-circle pointer svg-lg bg-white d-flex justify-content-center align-items-center"
                                    : "mr-1 svg-disabled rounded-circle pointer svg-lg bg-white d-flex justify-content-center align-items-center"
                            }>
                            <img src="/svgs/social/linkedin.svg" className="svg-sm" title="Linkedin" />
                        </div>
                        <div tabIndex={0} onKeyDown={(e) => e.key == "Enter" && this.editSocailLinks()}
                            onClick={() => this.editSocailLinks()}
                            className={
                                this.props.blog_link !== undefined &&
                                this.props.blog_link !== null &&
                                this.props.blog_link !== ""
                                    ? "mr-1 rounded-circle pointer svg-lg bg-white d-flex justify-content-center align-items-center"
                                    : "svg-disabled rounded-circle svg-lg bg-white d-flex justify-content-center pointer align-items-center"
                            }>
                            <img src="/svgs/social/twitter.svg" className="svg-sm" title="Twitter" />
                        </div>
                    </div>
                </div>
                <Modal show={this.state.social_links_modal} size={"lg"} onHide={this.closeSocialLinksModal}>
                    <div className="modal-content">
                        <div className="modal-header px-4">
                            <h5 className="modal-title" id="staticBackdropLabel">
                            {t(this.props.language?.layout?.profile_editlinks_nt)}
                            </h5>
                            <button
                                type="button"
                                className="close"
                                aria-label="Close"
                                onClick={this.closeSocialLinksModal}
                                title= {t(this.props.language?.layout?.all_close_nt)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body px-4 pt-0">
                            <div class="form-group animated">
                                <label class="form-label-active">{t(this.props.language?.layout?.profile_fblink_nt)}</label> 
                                <input
                                    type="text"
                                    class="form-control"
                                    value={this.state.facebook_link}
                                    onChange={(e) => this.setState({ facebook_link: e.target.value })}
                                />
                            </div>
                            <div class="form-group animated">
                                <label class="form-label-active">{t(this.props.language?.layout?.profile_inlink_nt)}</label> 
                                <input
                                    type="text"
                                    class="form-control"
                                    value={this.state.linkedin_link}
                                    onChange={(e) => this.setState({ linkedin_link: e.target.value })}
                                />
                            </div>
                            <div class="form-group animated">
                                <label class="form-label-active"> {t(this.props.language?.layout?.profile_trlink_nt)}</label> 
                                <input
                                    type="text"
                                    class="form-control"
                                    value={this.state.blog_link}
                                    onChange={(e) => this.setState({ blog_link: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="modal-footer py-3 px-4">
                            <div className="col-6 my-0"></div>
                            <div className="col-6 pr-0 mr-0">
                                <div className="d-flex">
                                    <div className="col-md-6">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-block"
                                            aria-label="Close"
                                            onClick={this.closeSocialLinksModal}>
                                            {t(this.props.language?.layout?.ep_setting_password_cancel)}
                                        </button>
                                    </div>
                                    <div className="col-md-6 p-0">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            onClick={this.validateLinks}>
                                            {t(this.props.language?.layout?.ep_setting_cd_save)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language
    };
}

export default connect(mapStateToProps, {})(withTranslation()(SocialLinks));