import React from "react";
import ScrollspyNav from "react-scrollspy-nav";
// import FooterUpdate from "../dashboard/_footer.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

const SignUpPrivacyEp = (props) => {
    let scrollref= useRef()

    const { t } = useTranslation();
    return (
        <div className="w-100 epModal mt-3 thin-scrollbar scrollbarDown1" ref={scrollref}  onScroll={(e)=>props.onScroll(e,scrollref)}>
            <div className="container scrolContainer1">
                <div className="row">
                    {/* <div className="col-md-3">
                        <ScrollspyNav
                            scrollTargetIds={[
                                "section_1",
                                "section_2",
                                "section_3",
                                "section_4",
                                "section_5",
                                "section_6",
                                "section_7",
                                "section_8",
                                "section_9",
                                "section_10",
                                "section_11",
                            ]}
                        >
                            <ul className="list-unstyled side_list">
                                <li className="mt-2">
                                    <a className="active" href="#section_1">{t(props.language?.layout?.policy_sidebar_header)}</a>
                                </li>
                                <li className="mt-2">
                                    <a href="#section_2" className="text-muted">{t(props.language?.layout?.policy_sidebar_definations)}</a>
                                </li>
                                <li>
                                    <a className="d-block text-muted " href="#section_3">
                                        {t(props.language?.layout?.policy_sidebar_service)}
                                    </a>
                                    <a className="d-block text-muted" href="#section_4">
                                        {t(props.language?.layout?.policy_sidebar_personaldata)}
                                    </a>
                                    <a className="d-block text-muted" href="#section_5">
                                        {t(props.language?.layout?.policy_sidebar_usagedata)}
                                    </a>
                                    <a className="d-block text-muted" href="#section_6">
                                        {t(props.language?.layout?.policy_sidebar_cookies)}
                                    </a>
                                    <a className="d-block text-muted" href="#section_7">
                                        {t(props.language?.layout?.policy_sidebar_datacontroller)}
                                    </a>
                                    <a className="d-block text-muted" href="#section_8">
                                        {t(props.language?.layout?.policy_sidebar_dataprocessors)}
                                    </a>
                                    <a className="d-block text-muted" href="#section_9">
                                        {t(props.language?.layout?.policy_sidebar_datasubject)}
                                    </a>
                                </li>
                                <li className="mt-2" >
                                    <a href="#section_10" className="text-muted">
                                        {t(props.language?.layout?.policy_informationcollection)}
                                    </a>
                                </li>
                                <li className="mt-2">
                                    <a href="#section_11" className="text-muted">{t(props.language?.layout?.policy_typesofdatacollcted)}</a>
                                </li>
                            </ul>
                        </ScrollspyNav>
                    </div> */}
                    <div className=" col-md-12">
                        <div>
                            <div>
                                <div id="section_New">
                                    {/* <h3 className="font-weight-bold">
                                    By signing up as an Employer Partner you agree that you:
                                    </h3> */}
                                    <p className="font-weight-bold">
                                    {/* Employer should self-attest as part of registration they: */}
                                    {t(props.language?.layout?.eppolicy_heading_nt)}:
                                        </p>
                                    <p className="h5-small">
                                    <span><img src="/svgs/icons_new/check-vector.svg" alt="-"/>
                                        </span>	{t(props.language?.layout?.eppolicy_info1_nt)}
                                    </p>
                                    <p className="h5-small">
                                    <span><img src="/svgs/icons_new/check-vector.svg" alt="-"/>
                                        </span>	{t(props.language?.layout?.eppolicy_info2_nt)}
                                    </p>
                                    <p className="h5-small">
                                    <span><img src="/svgs/icons_new/check-vector.svg" alt="-"/>
                                        </span>	{t(props.language?.layout?.eppolicy_info3_nt)}
                                    </p>
                                    <p className="h5-small">
                                    <span><img src="/svgs/icons_new/check-vector.svg" alt="-"/>
                                        </span>	{t(props.language?.layout?.eppolicy_info4_nt)}
                                    </p>
                                </div>
                                <div id="section_1">
                                    {/* <h3 className="font-weight-bold">
                                        {t(props.language?.layout?.policy_heading)}
                                    </h3> */}
                                    <p className="font-weight-bold mt-2">
                                    {t(props.language?.layout?.eppolicy_info5_nt)}:
                                    </p>
                                    <p>
                                        {t(props.language?.layout?.policy_description)}
                                    </p>
                                    <p>
                                        {t(props.language?.layout?.policy_description_2para)}
                                    </p>
                                    <p>
                                        {t(props.language?.layout?.policy_description_3para_1)}
                                        <a href="https://www.privacyshield.gov/" aria-describedby="Privacy Shield"> {t(props.language?.layout?.policy_description_3para_2)}</a>
                                    </p>
                                </div>
                                <div id="section_2">
                                    <h3 className="font-weight-bold">{t(props.language?.layout?.policy_definations)}</h3>
                                    <div id="section_3">
                                        <h3>{t(props.language?.layout?.policy_definations_service)}</h3>
                                        <p>
                                            {t(props.language?.layout?.policy_definations_service_description)}
                                        </p>
                                    </div>
                                    <div id="section_4">
                                        <h3>{t(props.language?.layout?.policy_definations_personaldata)}</h3>
                                        <p>
                                            {t(props.language?.layout?.policy_definations_personaldata_description)}
                                        </p>
                                    </div>
                                    <div id="section_5">
                                        <h3>{t(props.language?.layout?.policy_definations_usagedata)}</h3>
                                        <p>
                                            {t(props.language?.layout?.policy_definations_usagedata_description)}
                                        </p>
                                    </div>
                                    <div id="section_6">
                                        <h3>{t(props.language?.layout?.policy_definations_cookies)}</h3>
                                        <p>
                                            {t(props.language?.layout?.policy_definations_cookies_description)}
                                        </p>
                                    </div>
                                    <div id="section_7">
                                        <h3>{t(props.language?.layout?.policy_definations_datacontroller)}</h3>
                                        <p>
                                            {t(props.language?.layout?.policy_definations_datacontroller_description)}
                                        </p>
                                        {t(props.language?.layout?.policy_definations_datacontroller_description_2para)}
                                        <p></p>
                                        <p>
                                            {t(props.language?.layout?.policy_definations_datacontroller_description_3para)}
                                        </p>
                                    </div>
                                    <div id="section_8">
                                        <h3>{t(props.language?.layout?.policy_definations_dataprocessors)}</h3>
                                        <p>
                                            {t(props.language?.layout?.policy_definations_dataprocessors_description)}
                                        </p>
                                    </div>
                                    <div id="section_9">
                                        <h3>{t(props.language?.layout?.policy_definations_datasubject)}</h3>
                                        <p>
                                            {t(props.language?.layout?.policy_definations_datasubject_description)}
                                        </p>
                                    </div>
                                </div>
                                <div id="section_10">
                                    <h3 className="font-weight-bold">{t(props.language?.layout?.policy_informationcollection)}</h3>
                                    <p>
                                        {t(props.language?.layout?.policy_informationcollection_description)}
                                    </p>
                                </div>
                                <div id="section_11">
                                    <h3 className="font-weight-bold">{t(props.language?.layout?.policy_typesofdatacollcted)}</h3>
                                    <h3>{t(props.language?.layout?.policy_typesofdatacollcted_personaldata)}</h3>
                                    <p>
                                        {t(props.language?.layout?.policy_typesofdatacollcted_personaldata_description)}:
                                    </p>
                                    <ul className="list-unstyled">
                                        <li className="text-muted d-block">{t(props.language?.layout?.policy_typesofdatacollcted_personaldata_email)}</li>
                                        <li className="text-muted d-block">{t(props.language?.layout?.policy_typesofdatacollcted_personaldata_firstandlastname)}</li>
                                        <li className="text-muted d-block">{t(props.language?.layout?.policy_typesofdatacollcted_personaldata_phone)}</li>
                                        <li className="text-muted d-block">{t(props.language?.layout?.policy_typesofdatacollcted_personaldata_address)}</li>
                                        <li className="text-muted d-block">{t(props.language?.layout?.policy_typesofdatacollcted_personaldata_cookies)}</li>
                                    </ul>
                                    <p>
                                        {t(props.language?.layout?.policy_typesofdatacollcted_personaldata_info)}
                                    </p>
                                </div>
                                <div id="section_12">
                                    <h3>{t(props.language?.layout?.policy_sidebar_usagedata)}</h3>
                                    <p>{t(props.language?.layout?.pp_usagedata_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_usagedata_info2)}</p>
                                    <p>{t(props.language?.layout?.pp_usagedata_info3)}</p>
                                </div>
                                <div id="section_13">
                                    <h3>{t(props.language?.layout?.pp_locationdata)}</h3>
                                    <p>{t(props.language?.layout?.pp_locationdata_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_locationdata_info2)}</p>
                                </div>
                                <div id="section_14">
                                    <h3>{t(props.language?.layout?.pp_cookiesdata)}</h3>
                                    <p>{t(props.language?.layout?.pp_cookiesdata_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_cookiesdata_info2)}</p>
                                    <p>{t(props.language?.layout?.pp_cookiesdata_info3)}</p>
                                    <p>{t(props.language?.layout?.pp_cookiesdata_info4)}:</p>
                                    <ul>
                                        <li><strong>{t(props.language?.layout?.pp_cookiesdata_info4_1)}</strong> {t(props.language?.layout?.pp_cookiesdata_info4_1info)}</li>
                                        <li><strong>{t(props.language?.layout?.pp_cookiesdata_info4_2)}</strong> {t(props.language?.layout?.pp_cookiesdata_info4_1info)}</li>
                                        <li><strong>{t(props.language?.layout?.pp_cookiesdata_info4_3)}</strong> {t(props.language?.layout?.pp_cookiesdata_info4_1info)}</li>
                                    </ul>
                                </div>
                                <div id="section_15">
                                    <h3>{t(props.language?.layout?.pp_useofdata)}</h3>
                                    <p>{t(props.language?.layout?.pp_useofdata_info1)}:</p>
                                    <ul>
                                        <li>{t(props.language?.layout?.pp_useofdata_info2)}</li>
                                        <li>{t(props.language?.layout?.pp_useofdata_info3)}</li>
                                        <li>{t(props.language?.layout?.pp_useofdata_info4)}</li>
                                        <li>{t(props.language?.layout?.pp_useofdata_info5)} </li>
                                        <li>{t(props.language?.layout?.pp_useofdata_info6)}</li>
                                        <li>{t(props.language?.layout?.pp_useofdata_info7)}</li>
                                        <li>{t(props.language?.layout?.pp_useofdata_info8)}</li>
                                        <li>{t(props.language?.layout?.pp_useofdata_info9)}</li>
                                    </ul>
                                    <p>{t(props.language?.layout?.pp_useofdata_info10_1)}<a href="https://www.jamsadr.com/about/submitacase">{t(props.language?.layout?.pp_useofdata_info10_2)}</a>{t(props.language?.layout?.pp_useofdata_info10_3)}</p>
                                </div>
                                <div id="section_16">
                                    <h3 className="font-weight-bold">{t(props.language?.layout?.pp_leagalbasis)}</h3>
                                    <p>{t(props.language?.layout?.pp_leagalbasis_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_leagalbasis_info2)}:</p>
                                    <ul>
                                    <li>{t(props.language?.layout?.pp_leagalbasis_info3)} </li>
                                    <li>{t(props.language?.layout?.pp_leagalbasis_info4)} </li>
                                    <li>{t(props.language?.layout?.pp_leagalbasis_info5)}</li>
                                    <li>{t(props.language?.layout?.pp_leagalbasis_info6)}</li>
                                    </ul>
                                </div>
                                <div id="section_17">
                                    <h3>{t(props.language?.layout?.pp_retentiondata)}</h3>
                                    <p>{t(props.language?.layout?.pp_retentiondata_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_retentiondata_info2)}</p>
                                </div>
                                <div id="section_18">
                                    <h3>{t(props.language?.layout?.pp_transferdata)}</h3>
                                    <p>{t(props.language?.layout?.pp_transferdata_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_transferdata_info2)}</p>
                                    <p>{t(props.language?.layout?.pp_transferdata_info3)}</p>
                                    <p>{t(props.language?.layout?.pp_transferdata_info4)}</p>
                                    <p>{t(props.language?.layout?.pp_transferdata_info5_1)}<a href="https://www.privacyshield.gov/article?id=3-ACCOUNTABILITY-FOR-ONWARD-TRANSFER">{t(props.language?.layout?.pp_transferdata_info5_2)}</a>{t(props.language?.layout?.pp_transferdata_info5_3)}</p>
                                </div>
                                <div id="section_19">
                                    <h3 className="font-weight-bold">{t(props.language?.layout?.pp_disclosuredata)}</h3>
                                    <h3>{t(props.language?.layout?.pp_disclosurelw)}</h3>
                                    <p>{t(props.language?.layout?.pp_disclosurelw_info)}</p>
                                    <p><strong>{t(props.language?.layout?.pp_disclosurelw_legal)}</strong></p>
                                    <p>{t(props.language?.layout?.pp_disclosurelw_legalinfo)}:</p>
                                    <ul>
                                    <li>{t(props.language?.layout?.pp_disclosurelw_legalinfo1)}</li>
                                    <li>{t(props.language?.layout?.pp_disclosurelw_legalinfo2)}</li>
                                    <li>{t(props.language?.layout?.pp_disclosurelw_legalinfo3)}</li>
                                    <li>{t(props.language?.layout?.pp_disclosurelw_legalinfo4)}</li>
                                    <li>{t(props.language?.layout?.pp_disclosurelw_legalinfo5)}</li>
                                    </ul>
                                </div>
                                <div id="section_20">
                                    <h3>{t(props.language?.layout?.pp_securitydata)}</h3>
                                    <p>{t(props.language?.layout?.pp_securitydata_info)}</p>
                                </div>
                                <div id="section_21">
                                    <h3 className="font-weight-bold">{t(props.language?.layout?.pp_donottrack)}</h3>
                                    <p>{t(props.language?.layout?.pp_donottrack_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_donottrack_info2)}</p>
                                </div>
                                <div id="section_22">
                                    <h3>{t(props.language?.layout?.pp_gpr)}</h3>
                                    <p>{t(props.language?.layout?.pp_gpr_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_gpr_info2)}</p>
                                    <p>{t(props.language?.layout?.pp_gpr_info3)}:</p>
                                    <p><strong>{t(props.language?.layout?.pp_gpr_info4_1)}</strong>{t(props.language?.layout?.pp_gpr_info4_2)}<strong>{t(props.language?.layout?.pp_gpr_info4_3)}</strong>{t(props.language?.layout?.pp_gpr_info4_4)}</p>
                                    <p><strong>{t(props.language?.layout?.pp_gpr_info5_1)}</strong> {t(props.language?.layout?.pp_gpr_info5_2)}<strong>{t(props.language?.layout?.pp_gpr_info5_3)}</strong> {t(props.language?.layout?.pp_gpr_info5_4)}</p>
                                    <p><strong>{t(props.language?.layout?.pp_gpr_info6_1)}</strong>{t(props.language?.layout?.pp_gpr_info6_2)}<strong>{t(props.language?.layout?.pp_gpr_info6_3)}</strong>{t(props.language?.layout?.pp_gpr_info6_4)}</p>
                                    <p>{t(props.language?.layout?.pp_gpr_info7)}</p>
                                    <p>{t(props.language?.layout?.pp_gpr_info8)}</p>
                                </div>
                                <div id="section_23">
                                    <h3>{t(props.language?.layout?.pp_californiacr)}</h3>
                                    <p>{t(props.language?.layout?.pp_californiacr_info1)}:</p>
                                    <ul>
                                        <li><strong>{t(props.language?.layout?.pp_californiacr_info2_1)}:</strong>{t(props.language?.layout?.pp_californiacr_info2_2)}</li>
                                        <li className="my-2"><strong>{t(props.language?.layout?.pp_californiacr_info3_1)}:</strong>{t(props.language?.layout?.pp_californiacr_info3_2)}</li>
                                        <li><strong>{t(props.language?.layout?.pp_californiacr_info4_1)}:</strong>{t(props.language?.layout?.pp_californiacr_info4_2)}</li>
                                        <li className="my-2"><strong>{t(props.language?.layout?.pp_californiacr_info5_1)}:</strong>{t(props.language?.layout?.pp_californiacr_info5_2)}</li>
                                        <li><strong>{t(props.language?.layout?.pp_californiacr_info6_1)}:</strong>{t(props.language?.layout?.pp_californiacr_info6_2)}</li>
                                    </ul>
                                </div>
                                <div id="section_24">
                                    <h3>{t(props.language?.layout?.pp_serviceproviders)}</h3>
                                    <p>{t(props.language?.layout?.pp_serviceproviders_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_serviceproviders_info2)}</p>
                                </div>
                                <div id="section_25">
                                    <h3>{t(props.language?.layout?.pp_linktosite)}</h3>
                                    <p>{t(props.language?.layout?.pp_linktosite_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_linktosite_info2)}</p>
                                </div>
                                <div id="section_26">
                                    <h3>{t(props.language?.layout?.pp_childrenprivacy)}</h3>
                                    <p>{t(props.language?.layout?.pp_childrenprivacy_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_childrenprivacy_info2)}</p>
                                </div>
                                <div id="section_27">
                                    <h3>{t(props.language?.layout?.pp_changesinpolicy)}</h3>
                                    <p>{t(props.language?.layout?.pp_changesinpolicy_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_changesinpolicy_info2)}</p>
                                    <p>{t(props.language?.layout?.pp_changesinpolicy_info3)}</p>
                                </div>
                                <div id="section_28">
                                    <h3 className="font-weight-bold">{t(props.language?.layout?.pp_aldispute)}</h3>
                                    <p>{t(props.language?.layout?.pp_aldispute_info1)}</p>
                                    <p>{t(props.language?.layout?.pp_aldispute_info2_1)}<a href="https://www.jamsadr.com/about/submitacase">{t(props.language?.layout?.pp_aldispute_info2_2)}</a>{t(props.language?.layout?.pp_aldispute_info2_3)}<a href="https://www.privacyshield.gov/article?id=ANNEX-I-introduction">{t(props.language?.layout?.pp_aldispute_info2_2)}</a></p>
                                </div>
                                <div id="section_29">
                                    <h3>{t(props.language?.layout?.about_contact)}</h3>
                                    <p>{t(props.language?.layout?.pp_contact_info1)}:</p>
                                    <ul>
                                        <li>{t(props.language?.layout?.pp_contact_info2)}: privacy@simplifyworkforce.com {t(props.language?.layout?.all_or_nt)} gdpr@simplifyworkforce.com</li>
                                        <li>{t(props.language?.layout?.pp_contact_info3)}: +1 888 585 8125 </li>
                                        <li>{t(props.language?.layout?.pp_contact_info4)}: ATTN: Data Privacy Officer, Simplify Workforce Inc., PO Box 413, Jersey City, NJ 07303.</li>
                                    </ul>
                                </div>
                                <div id="section_30">
                                    <h3>{t(props.language?.layout?.pp_changestonotice)}</h3>
                                    <p>{t(props.language?.layout?.pp_changestonotice_info)}</p>
                                </div>
                                <div>
                                    <h2 className="font-weight-bold h1">{t(props.language?.layout?.termsofservice)}</h2>
                                    <p>{t(props.language?.layout?.termsofservice_link1)}<a href="/terms-of-service" target="_blank">{t(props.language?.layout?.termsofservice)}</a>{t(props.language?.layout?.termsofservice_link2)}.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <FooterUpdate /> */}
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}


export default connect(mapStateToProps)(SignUpPrivacyEp);
