import React from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { job_type_1, jobstage_1, jobstage } from "../../../translations/helper_translation.jsx";
const ReportTable = (props) => {
    const { t } = useTranslation();
    const data = props.data;
    const titleCase = (string) => {
        return String(string || "")
            .toLowerCase()
            .split("_")
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    };
    const jobTypeHandler = (language, key) => {
        return(job_type_1[language][key]);
    }
    const jobStageHandler = (language, key) => {
        return(jobstage_1[language][key]);
    }
    const jobSeekerStatusHandler = (language, key) => {
        return(jobstage[language][key]);
    }
    return (
        <>
            {data && data.length !== 0 ? (
                <div className="card-body p-0">
                    <div className="table-responsive table-min-height reports-table">
                        <table
                            className="table text-center border-bottom mb-0 text-nowrap" tabIndex="0"
                        // style={{ minWidth: "max-content" }}
                        >
                            <thead className="text-white thead" style={{ backgroundColor: "rgb(47, 47, 47)" }}>
                                <tr>
                                    {data[0].single.slice(0, 1).map((m) => (
                                        <th
                                            scope="col"
                                            className="pl-3 align-middle font-weight-normal position-sticky"
                                            style={{
                                                left: 0,
                                                zIndex: 2,
                                                backgroundColor: "rgb(47, 47, 47)",
                                                width: "200px",
                                            }}>
                                            {titleCase(m.name)}
                                        </th>
                                    ))}
                                    {data[0].single.slice(1).map((m) => (
                                        <th
                                            scope="col"
                                            className="pl-3 align-middle font-weight-normal "
                                            style={{ left: 0, zIndex: 2, backgroundColor: "rgb(47, 47, 47)" }}>
                                            {titleCase(m.name)}
                                        </th>
                                    ))}
                                    {data[0].double.map((double) =>
                                        double.data.map((m) =>
                                            double.head.toLowerCase() == "count" ? (
                                                <th width="100px" className="align-middle font-weight-normal">
                                                    {`${titleCase(m.name)}`}
                                                    {/* <br />
                                                    {`${double.head}`} */}
                                                </th>
                                            ) : (
                                                <th width="100px" className="align-middle font-weight-normal">
                                                    {/* {`${double.head}`}
                                                    <br /> */}
                                                    {`${titleCase(m.name)}`}
                                                </th>
                                            )
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(data).map((each) => (
                                    <tr>
                                        {each.single.slice(0, 1).map((m) => (                                            
                                            <td
                                                className="pl-3 align-middle position-sticky bg-white text-left"
                                                style={{ left: 0, zIndex: 2 }}>
                                                    {m.name == "Job Stage" || m.name == "Etapa de empleo" || m.name == "Étape de travail" ? jobStageHandler(props?.languageName, m.value) : m.value}
                                            </td>
                                        ))}
                                        {each.single.slice(1).map((m) => (
                                            <td className="pl-3 align-middle" style={{ left: 0, zIndex: 2 }}>
                                                {
                                                    m.name == "Job Type " || m.name == "Tipo de empleo " || m.name == "Type d'emploi" ? jobTypeHandler(props?.languageName, m.value)
                                                    : m.name == "Job Seeker Status" || m.name == "Estado de Demandante de empleo" || m.name == "Statut de demandeur d'emploi" ? jobSeekerStatusHandler(props?.languageName, m.value) 
                                                    : m.value
                                               }
                                            </td>
                                        ))}
                                        {each.double.map((double) =>
                                            double.data.map((m) => (
                                                <td
                                                    className="pl-3 align-middle"
                                                    style={{ width: `${100 / double.data.length}%` }}>
                                                    {m.name == "Job Type " || m.name == "Tipo de empleo " || m.name == "Type d'emploi" ? jobTypeHandler(props?.languageName, m.value) : m.value }
                                                </td>
                                            ))
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="col-md-3 mx-auto">
                    <div className="text-muted text-center mt-5 pt-5">
                        <img src="/svgs/illustrations/EmptyStateListIllustration.svg" className="svg-gray img-fluid" />
                        <h3 className="pt-2">{t(props.language?.layout?.all_empty_nt)}</h3>
                    </div>
                </div>
            )}
        </>
    );
};

function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
        languageName: state.authInfo.languageName
    };
}

export default connect(mapStateToProps)(ReportTable);
