import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Multiselect } from "multiselect-react-dropdown";
import { Link, useHistory } from "react-router-dom";
import ReactQuill from "react-quill";
import axios from "axios";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { nullHandler } from "../components/constants.jsx";
import Select from 'react-select';

const inviteCandidate = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const msgText = t(props.language?.layout?.all_info_nt);
    const [invite, setInvite] = useState([]);
    const [preferedTitle, setPrefered] = useState([]);
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState(msgText);
    const [perferences, setPerferences] = useState([]);

    useEffect(() => {
        inviteCandidateHandler();
    }, [props.userId, props.languageName]);
    // console.log("history",history.location.state.slug)
    const preSelectedJobs = (slugs, lists) => {
        let addedKeyLists = [];
        lists.forEach((itemItem) => {
            // console.log("itemItem.slug",itemItem.slug);
            if (itemItem.slug == slugs) {
                addedKeyLists.push(itemItem);
                setPrefered(addedKeyLists);
                UpdatePerferences(addedKeyLists)
            }
        });
    };

    const inviteCandidateHandler = (id) => {
        setUserId(props.userId);
        axios
            .get("api/v1/recruiter/assign/jobs", {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                var data;
                if (props.languageName == 'en') {
                    data = nullHandler(JSON.parse(JSON.stringify(response.data.data)), 'title')
                }
                if (props.languageName == 'esp') {
                    data = nullHandler(JSON.parse(JSON.stringify(response.data.data)), 'title_esp')
                }
                if (props.languageName == 'fr') {
                    data = nullHandler(JSON.parse(JSON.stringify(response.data.data)), 'title_fr')
                }
                // console.log("data titlewise",data)
                let updateData = data.map(list => {
                    if(props.languageName == 'en'){
                        return   {
                        ...list,
                        title: list.title + " - " + list.tenant__name
                    }}
                    if(props.languageName == 'esp'){
                        return {
                            ...list,
                            title_esp: list.title_esp + " - " + list.tenant__name
                    }}
                    if(props.languageName == 'fr'){
                        return {
                          ...list,
                          title_fr: list.title_fr + " - " + list.tenant__name
                    }}
                })
                setInvite(updateData);
                const slugs = history?.location?.state?.slug;
                preSelectedJobs(slugs, response.data.data);
            });
    };

    const onChange = (data) => {
        setMessage(data);
    };
    const UpdatePerferences = (IdList) => {
        setPrefered(IdList);
        let prefIds = [];
        Object.values(
            IdList.map((x) =>
                prefIds.push(x.id)
            )
        );
        setPerferences(prefIds);
    };

    const jobHandler = () => {
        // if (!perferences || !message) {
        //     toast.error("Please enter required details", { toastId: "id1" });
        //     return false;
        // }
        const lang = props.languageName;
        axios
            .post(
                // Axios.get("/api/v1/notifications/all?page=" + pageCount+"&lang="+ lang, {
                `api/v1/recruiter/assign/${userId}?lang=` + lang,
                // api/v1/recruiter/assign/<int:candidate_id>
                {
                    job_ids: perferences,
                    text: message,
                },
                { headers: { Authorization: `Bearer ${props.userToken}` } }
            )
            .then((response) => {
                // console.log(response.data, "data");
                if (response.data.status == 200) {
                    toast.success(t(props.language?.layout?.toast114_nt));
                }
                removeHandler();
            })
            .catch((error) => {
                toast.error(error.response.data.detail || t(props.language?.layout?.toast53_nt));
                removeHandler();
            });
    };

    const removeHandler = () => {
        props.closeinviteModal();
        setPerferences([]);
        setMessage(msgText);
    };
    const langNullHandler = (lang, check) => {
        let updatedData = [];
        let title = ""
        if (lang == "fr") {
            if (check[0]?.title_fr == null || check[0]?.title_fr == "") {
                check.forEach((item) => {
                    item.title_fr = item.title;
                    updatedData.push(item);
                })
            }
            title = "title_fr";
        }
        if (lang == "esp") {
            if (check[0]?.title_esp == null || check[0]?.title_esp == "") {
                check.forEach((item) => {
                    item.title_esp = item.title;
                    updatedData.push(item);
                })
            }
            title = "title_esp"
        }
        if (lang == "en") {
            title = "title";
        }
        return title;
    }
    //   console.log(message,"mess")
    const modules = {
        toolbar: [
            [{ align: "right" }, { align: "center" }],
            ["bold", "italic", "underline"],
        ],
    };
    const formats = [
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
        "align",
    ];
    return (
        <Modal size="lg" show={props.showinviteModal} onHide={removeHandler} centered>
            <div className="modal-content">
                <div className="modal-header px-4">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        {t(props.language?.layout?.inviteseeker_nt)}
                    </h5>
                    <button
                        type="button"
                        className="close animate-closeicon"
                        aria-label="Close"
                        title="Close"
                        onClick={removeHandler}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body px-4 pt-0">
                    <div class="form-group animated">
                        <label class="form-label-active z-index4 mb-2">{t(props.language?.layout?.selectjob_nt)} *</label>
                        {/* <Multiselect
                            options={invite}
                            // selectionLimit="1"
                            selectedValues={preferedTitle}
                            // displayValue={"title"}
                            displayValue={langNullHandler(props.languageName, preferedTitle)}
                            onSelect={UpdatePerferences}
                            onRemove={UpdatePerferences}
                            avoidHighlightFirstOption={true}
                            showArrow={true}
                            placeholder={t(props.language?.layout?.selectjob_nt)}
                        /> */}
                         <Select
                            getOptionLabel={invite => props.languageName == 'en' ? invite.title : props.languageName == 'esp' ? invite.title_esp : invite.title_fr}
                            getOptionValue={invite => invite.id}
                            options={invite}
                            value={preferedTitle}
                            onChange={UpdatePerferences}
                            isMulti={true}
                            placeholder={t(props.language?.layout?.selectjob_nt)}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                  ...theme.colors,
                                  primary: '#cccccc',
                                },
                              })}
                        />
                    </div>

                    <div class="form-group animated mt-n2">
                        <label class="form-label-active" for="textarea">
                            {t(props.language?.layout?.ep_message)}
                        </label>
                        <ReactQuill
                            theme="snow"
                            value={message}
                            modules={modules}
                            formats={formats}
                            onChange={onChange}></ReactQuill>
                    </div>
                </div>
                <div className="modal-footer py-3 px-4">
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-outline-secondary px-5 mr-3" onClick={removeHandler}>
                            {t(props.language?.layout?.sp_adddetails_cancel)}
                        </button>
                        <button
                            onClick={jobHandler}
                            disabled={perferences.length < 1}
                            className="btn btn-primary brand-color px-5">
                            {t(props.language?.layout?.ep_importjob_submit)}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
function mapStateToProps(state) {
    return {
        theme: state.themeInfo.theme,
        userToken: state.authInfo.userToken,
        language: state.authInfo.language,
        languageName: state.authInfo.languageName,
    };
}

export default connect(mapStateToProps, {})(inviteCandidate);
