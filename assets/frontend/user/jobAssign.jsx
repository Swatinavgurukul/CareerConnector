import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { connect } from "react-redux";
import { Multiselect } from "multiselect-react-dropdown";
import { toast } from "react-toastify";

const JobAssign = (props) => {
    const { theme } = props;
    const [assignJob, setAssignJob] = useState([]);
    const [assignStatus, setAssignStatus] = useState("");
    const [userId, setUserId] = useState("");
    const [comments, setComments] = useState("");
    const [assignPerferences, setAssignPerferences] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        assignJobHandler();
    }, [props.userId]);

    const assignJobHandler = (id) => {
        setUserId(props.userId);
        axios
            .get("api/v1/recruiter/assign/jobs", {
                headers: { Authorization: `Bearer ${props.userToken}` },
            })
            .then((response) => {
                // console.log(response.data.data, " ==== ress000000000 ==== ", response.data.data.id);
                setAssignJob(response.data.data);
            });
    };

    const assignHandler = () => {
        if (!assignStatus || !assignPerferences) {
            toast.error("Please enter required details", { toastId: "id1" });
            return false;
        }
        setIsButtonDisabled(true);
        axios
            .post(
                `/api/v1/recruiter/assign/${assignPerferences}/${userId}`,
                {
                    status: assignStatus,
                    note_text: comments,
                },
                { headers: { Authorization: `Bearer ${props.userToken}` } }
            )
            .then((response) => {
                // setDeleteModal(false);
                toast.success("Job Assigned Successfully", {});
                removeHandler();
                setIsButtonDisabled(false);
                // console.log(response.data, "data");
            })
            .catch((error) => {
                if (error.response.status == 500 || error.response.status == 504) {
                    removeHandler();
                    setIsButtonDisabled(false);
                }
                // console.log(error);
            });

        // console.log(assignPerferences ,comments,assignStatus,"....")
    };

    const onSelect = (selectedList, selectedItem) => {
        setAssignPerferences(selectedItem.id);
    };

    const onRemove = () => {
        setAssignPerferences("");
    };
    const removeHandler = () => {
        props.closeAssignModal();
        setAssignPerferences("");
        setAssignStatus("");
        setComments("");
        setIsButtonDisabled(false);
    };

    return (
        <Modal size="lg" show={props.showAssignModal} onHide={removeHandler} centered>
            <div className="modal-content">
                <div className="modal-header px-4">
                    <h5 className="modal-title" id="staticBackdropLabel">
                        Assign job opening
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
                        <label class="form-label-active z-index4 mb-2">Assign job *</label>
                        <Multiselect
                            options={assignJob}
                            selectionLimit="1"
                            displayValue={"title"}
                            onSelect={onSelect}
                            onRemove={onRemove}
                            avoidHighlightFirstOption={true}
                            showArrow={true}
                            placeholder={assignPerferences !== "" ? "" : "Select Job"}
                        />
                    </div>
                    <div class="form-group animated">
                        <label for="assignstatus" class="form-label-active">
                            Assign status *
                        </label>
                        <select
                            class="form-control px-1"
                            onChange={(e) => setAssignStatus(e.target.value)}
                            // value={assignStatus}
                            id="assignstatus">
                            <option selected value="" disabled>
                                Select Status
                            </option>
                            {/* <option value="sourced">Sourced</option> */}
                            <option value="applied">Applied</option>
                            <option value="screening">Screening</option>
                            <option value="interview">Interview</option>
                            <option value="offered">Offered</option>
                            <option value="hired">Hired</option>
                            <option value="declined">Declined</option>
                            <option value="on-hold">On hold</option>
                        </select>
                    </div>
                    <div class="form-group animated mt-n2">
                        <label class="form-label-active" for="textarea">
                            Comments
                        </label>
                        <textarea
                            rows="2"
                            type="text"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            class="form-control"
                            id="textarea"
                            name="textarea"></textarea>
                    </div>
                </div>
                <div className="modal-footer py-3 px-4">
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-outline-secondary mr-3" onClick={removeHandler}>
                            Cancel
                        </button>
                        <button
                            onClick={assignHandler}
                            // data-toggle="dropdown"
                            disabled={!(assignPerferences && assignStatus) || isButtonDisabled}
                            className="btn btn-primary brand-color">
                            Assign
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
    };
}

export default connect(mapStateToProps, {})(JobAssign);
