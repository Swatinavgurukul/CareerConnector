import React, { Component } from 'react'
import TagsInput from "react-tagsinput";
import Modal from "react-bootstrap/Modal";
import SkillsDropDown from "./skills_dropdown.jsx";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

class adminSkills extends Component {
    constructor(props) {
        super(props)

        this.state = {
            skills: {},
            addSKill: {},
            flag: false,
            admin_skills_modal: false,
            skillsArray: [],
        }
    }
    addSkillModal = () => {
        this.setState({
            admin_skills_modal: true,
        })
    };
    closeAdminSkillsModal = () => {
        this.setState({ admin_skills_modal: false });
    };
    addSkills = () => {
        // if (Object.keys(this.state.addSKill).length === 0) {
        //     return;
        // }
        // var flag = false;
        // var temp = [];
        // Object.values(this.props.skills).map((x) => {
        //     temp.push(x.skills);
        // });
        // if (this.props.skills.length === 0) {
        //     flag = true;
        // }
        // // console.log(temp, this.state.addSKill);
        // for (let i = 0; i < temp.length; i++) {
        //     if (temp[i].toLowerCase() === this.state.addSKill.toLowerCase()) {
        //         this.setState({ addSKill: {} });
        //         alert("Please enter unique skills");
        //         flag = false;
        //         break;
        //     } else {
        //         flag = true;
        //     }
        // }
        // if (flag === true) {
        // console.log("in if put condition ", flag);
        // flag = false;
        this.props.addToServer({ skill: { skills: this.state.skillsArray } });
        this.setState({ addSKill: {} });
        // }
        this.setState({ admin_skills_modal: false, addSKill: {} });
    };

    deleteSkills = (data) => {
        // this.setState({ addSkillTextbox: false });
        this.props.delete({ skill: {} }, data);
    };
    skillsData = (data) => {
        var skillValues = [];
        // console.log(data)
        Object.values(data).map(x => {
            skillValues.push(x.name)
            // console.log(x.id, " in skillsss ");
        })
        this.setState({ skillsArray: skillValues })
    };
    render() {
        const { t } = this.props;
        var fieldsArray = [];
        {
            Object.values(this.props.skills).map((x) => {
                fieldsArray.push(
                    <div className="d-inline-block">
                        <div class="nav nav-pills mr-1 mt-0">
                            <div class="mb-1 d-flex border border-dark rounded mr-1">
                                <a class="text-decoration-none px-2 py-1 text-dark">{x.skills}</a>
                                {/* <div className="d-none hideElement"> */}
                                {!this.props.fromApplication ?
                                    <div>
                                        <button
                                            type="button"
                                            class="close pr-1 mt-1 float-none"
                                            aria-label="Close"
                                            onClick={(e) => this.deleteSkills(x.id)}
                                            title= {this.props.t(this.props.language?.layout?.all_delete_nt)}>
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div> : ""}
                            </div>
                        </div>
                    </div>
                );
            });
        }
        //  console.log(this.props.skills ,"ski")

        return (
            <div className="container-fluid px-md-0">
                <div className="skill  d-flex justify-content-between">
                    <h3>{t(this.props.language?.layout?.js_dashboard_skills)}</h3>
                    {this.props.skills.length > 0 && this.props.skills !== "" && !this.props.fromApplication ?
                        <a
                            tabIndex="0"
                            type="button"
                            className="btn buttonFocus text-primary d-print-none mt-n1 ml-2"
                            onClick={this.addSkillModal}
                        >
                            {t(this.props.language?.layout?.js_profile_addskills)}
                        </a> : ""}
                </div>
                <hr className="mt-1" />
                {this.props.skills.length > 0 && this.props.skills !== "" ? fieldsArray :
                    <div className={"text-muted " + (!this.props.fromApplication ? " " : " mb-2")}> {t(this.props.language?.layout?.js_profile_noskills_nt)}
                        {!this.props.fromApplication ?
                            <a
                                tabIndex="0"
                                type="button"
                                className="btn buttonFocus text-primary d-print-none mt-n1 ml-2"
                                onClick={this.addSkillModal}
                            >
                                {t(this.props.language?.layout?.js_profile_addskills)}
                            </a> : ""}
                    </div>
                }

                <Modal show={this.state.admin_skills_modal} size={"lg"} onHide={this.closeAdminSkillsModal} centered>
                    <div className="modal-content">
                        <div className="modal-header px-4">
                            <h5 className="modal-title" id="staticBackdropLabel">
                                {t(this.props.language?.layout?.profile_seekerskill_nt)}
                            </h5>
                            <button
                                type="button"
                                className="close animate-closeicon"
                                aria-label="Close"
                                onClick={this.closeAdminSkillsModal}
                                title= {t(this.props.language?.layout?.all_close_nt)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body px-4 pt-0">
                            <div className="row">
                                <div className="col-12 mt-3">
                                    <div class="form-group animated" >
                                        {/* <label class="form-label-active">Skills *</label> */}
                                        <SkillsDropDown skillsData={this.skillsData} languageName={this.props?.languageName} />
                                        {/* <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Add Skill"
                                    onChange={(e) => this.setState({ addSKill: e.target.value })}
                                    name="skills"
                                    autocomplete="off"
                                /> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer py-3 px-4">
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-outline-secondary mr-3" onClick={this.closeAdminSkillsModal}>
                                    {t(this.props.language?.layout?.js_account_cancel)}
                                </button>
                                <button className="btn btn-primary brand-color" onClick={(e) => this.addSkills()}>
                                    {t(this.props.language?.layout?.js_profile_addskills)}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div >
        )
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName

    };
}

export default connect(mapStateToProps, {})(withTranslation()(adminSkills));