import React from "react";
import ReactDOM from "react-dom";
import ReactTags from "react-tag-autocomplete";
import Axios from "axios";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
class SkillDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            skillsTags: [],
            suggestions: [],
        };

        this.reactTags = React.createRef();
    }

    componentDidMount() {
        this.getSkillsData();
    }

    getSkillsData = (query) => {
        let apiEndpoint;
        if (query) {
            apiEndpoint = `api/v1/skill/dataset?query=${query}&&lang=${this.props?.languageName}`;
        } else {
            apiEndpoint = `api/v1/skill/dataset?lang=${this.props?.languageName}`;
        }
        Axios.get(apiEndpoint, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        }).then((response) => {
            // console.log(response.data.data);
            this.setState({ suggestions: response.data.data });
        });
    };
    onDelete = (i) => {
        let deleteSkill = this.state.skillsTags.slice(0);
        deleteSkill.splice(i, 1);
        this.setState({ skillsTags: deleteSkill })
        this.updateSkills(deleteSkill);
    };
    updateSkills = (data) => {
        this.props.skillsData(data);
    }
    onAddition = (tag) => {
        const addSkill = [].concat(this.state.skillsTags, tag);
        var names = this.state.skillsTags.map(({ name }) => name);
        // console.log(names," in names")
        if (!names.includes(tag.name)) {
            this.setState({ skillsTags: addSkill })
        }
        if (this.state.skillsTags.includes(tag)) {
            return;
        }
        if (this.state.suggestions.includes(tag)) {
            this.state.suggestions = this.state.suggestions.filter(
                (val) => !addSkill.includes(val)
            );
            this.setState({ suggestions: this.state.suggestions });
        }
        // console.log(addSkill)
        // this.setState({skillsTags:addSkill})
        this.updateSkills(addSkill)
    };
    onInput = (query) => {
        if (query.length >= 2) this.getSkillsData(query);
        return;
    };
    render() {
        const { t } = this.props; 
        return (
            <ReactTags
                ref={this.reactTags}
                tags={this.state.skillsTags}
                suggestions={this.state.suggestions}
                onDelete={this.onDelete}
                onAddition={this.onAddition}
                minQueryLength={0}
                allowNew
                placeholderText={t(this.props.language?.layout?.js_profile_addskills)}
                onInput={this.onInput}
            />
        );
    }
}
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps, {})(withTranslation()(SkillDropdown));