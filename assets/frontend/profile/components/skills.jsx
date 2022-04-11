import React, { Component } from "react";
import SkillsDropDown from "./skills_dropdown.jsx";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

class Skills extends Component {
    constructor() {
        super();
        this.state = {
            addSkillTextbox: false,
            skills: {},
            addSKill: {},
            flag: false,
            showCloseIcon: false,
            skillsArray: [],
        };
    }

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
        //     console.log("in if put condition ", flag);
        //     flag = false;
        this.props.addToServer({ skill: { skills: this.state.skillsArray } });
        this.setState({ addSkillTextbox: false, addSKill: {} });
        // }
        // this.setState({ addSkillTextbox: false, addSKill: {} });
    };

    deleteSkills = (data) => {
        this.setState({ addSkillTextbox: false });
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
                        <div class="nav nav-pills mr-1 mt-0 hoveredElement">
                            <div class="mb-1 d-flex border border-primary rounded mr-1">
                                <a class="text-decoration-none px-2 py-1 text-primary">{x.skills}</a>
                                {/* <div className="d-none hideElement"> */}
                                <div className={this.props.isPreviewMode ? "d-none" : "d-none hideElement"}>
                                    <button
                                        type="button"
                                        class="close pr-1"
                                        aria-label="Close"
                                        onClick={(e) => this.deleteSkills(x.id)}
                                        title={this.props.t(this.props.language?.layout?.all_delete_nt)}>
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            });
        }
        return (
            <>
                {fieldsArray}
                <div className="ml-auto rounded-0 w-75 mt-3 position-relative">
                    {this.state.addSkillTextbox === false && (
                        <button
                            className={`float-right btn btn-primary d-print-none ${this.props.isPreviewMode ? "d-none" : ""
                                }`}
                            type="button"
                            onClick={(e) => this.setState({ addSkillTextbox: true })}>
                            {t(this.props.language?.layout?.js_profile_add)}
                        </button>
                    )}
                    {this.state.addSkillTextbox === true && (
                        <div>
                            <SkillsDropDown skillsData={this.skillsData} languageName={this.props?.languageName} />

                            {/* <input
                                type="text"
                                className="form-control"
                                onChange={(e) => this.setState({ addSKill: e.target.value })}
                            /> */}
                            <div className="mt-2 d-flex justify-content-between">
                                <button
                                    type="button"
                                    className="btn btn-light px-3"
                                    onClick={(e) => this.setState({ addSkillTextbox: false })}>
                                    {t(this.props.language?.layout?.js_account_cancel)}
                                </button>
                                <button type="button" className="btn btn-light px-4" onClick={(e) => this.addSkills()}>
                                    {t(this.props.language?.layout?.js_profile_add)}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(withTranslation()(Skills));