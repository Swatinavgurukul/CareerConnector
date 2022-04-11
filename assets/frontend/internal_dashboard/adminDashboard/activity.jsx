import React, { useEffect, useState } from "react";
import Axios from "axios";
import { renderToLocaleDate } from "../../modules/helpers.jsx"
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";


const ActivityStream = (props) => {
    const { t } = useTranslation();
    const [upcomingInterview, setUpcomingInterview] = useState([]);
    const getData = () => {
        let apiEndPoint = props.userRole.role_id == null ? `/api/v1/admin/dashboard/upcominginterviews` : `/api/v1/hiring/dashboard/upcominginterviews`;
        Axios.get(apiEndPoint, {
            headers: { Authorization: `Bearer ${props.userToken}` },
        })
            .then((response) => {
                let interviews = []
                response.data.data.forEach(e => {
                    interviews.push(e)
                })
                setUpcomingInterview(interviews);
            }).catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className="h-100">
            <div className="mb-3 d-flex flex-column">
                <div className="d-flex bg-white">
                <h5>{t(props.language?.layout?.ep_dashboard_cominginterview)} <abbr title= {t(props.language?.layout?.dashborad_abbr3_nt)} className="align-top d-inline-flex"><img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" /></abbr></h5>
                </div>
                <div className="border rounded thin-scrollbar" tabIndex="0" style={{ backgroundColor: "rgb(238, 250, 255)", height: '30vh', overflowY: 'auto' }}>
                    <div className="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">{t(props.language?.layout?.ep_dashboard_name)}</th>
                                    <th scope="col">{t(props.language?.layout?.ep_dashboard_date)}</th>
                                </tr>
                            </thead>
                            {upcomingInterview.length ? (
                                <tbody>
                                    {upcomingInterview.map(ui => (
                                        <tr>
                                            <td className="text-capitalize">{ui.application__user__first_name || ''} {ui.application__user__last_name || ''}</td>
                                            <td>{renderToLocaleDate(ui.interview_date)}, {(ui.interview_time || '').split(':').slice(0, 2).join(':')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : <p className="p-2">{t(props.language?.layout?.nointerview_nt)}</p>} 
                        </table>
                    </div>
                </div>
            </div>
            {/* <div className="d-flex bg-white">
                <h5>To Do List <abbr title="this is summary card" className="align-top d-inline-flex"><img src="/svgs/icons_new/info.svg" alt="info" className="svg-xs-1 align-top" /></abbr></h5>
            </div> */}
            {/* <div className="mb-3 rounded" style={{ backgroundColor: "rgb(253, 249, 242)" }}>
                <div className="border rounded overflow-auto">
                    {ToDoList.map((todo) => (
                        <div key={todo.index} className="p-3">
                            <div className="d-flex justify-content-between">
                                <span>
                                    <img src="/svgs/icons_new/check.svg" class="svg-sm" alt="icon" />
                                </span>
                                <p className="m-0 pl-3 pr-3">{todo.text}</p>
                                <img
                                    src="/svgs/icons_new/edit-2.svg"
                                    class="svg-sm"
                                    alt="icon"
                                    onClick={() => {
                                        setAddNote(false);
                                        setNewNote(defaultNote);
                                        setNewNote(todo);
                                        setAddNote(true);
                                    }}
                                />
                            </div>
                            <p className="m-0 text-right" style={{ fontSize: "smaller" }}>
                                {todo.date}
                            </p>
                        </div>
                    ))}
                    <div className={ToDoList.length != 0 ? "pl-3 pb-3" : "pl-3 pb-3 pt-3"}>
                        {addNote ? (
                            <img src="/svgs/icons_new/x-circle.svg" class="svg-sm" alt="icon" onClick={CloseNote} />
                        ) : (
                            <img src="/svgs/icons_new/plus-circle.svg" class="svg-sm" alt="icon" onClick={AddNote} />
                        )}
                    </div>
                </div>
                {addNote ? (
                    <div class="form-group border">
                        <textarea
                            class="form-control no-outline shadow-none"
                            style={{ resize: "none" }}
                            placeholder="Add note"
                            rows="3"
                            value={newNote.text}
                            onChange={(e) => setNewNote({ ...newNote, text: e.target.value })}></textarea>
                        <div className="d-flex bg-white p-3">
                            <div>Due Date</div>
                            <span style={{ flex: "1 1" }}></span>
                            <button className="btn btn-primary" onClick={UpdateToDoList}>
                                Done
                            </button>
                        </div>
                    </div>
                ) : null}
            </div> */}
        </div>
    );
};

function mapStateToProps(state) {
    return {
        userToken: state.authInfo.userToken,
        userRole: state.authInfo.user,
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(ActivityStream);