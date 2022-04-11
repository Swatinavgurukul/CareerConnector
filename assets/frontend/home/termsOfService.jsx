import React from "react";
import ScrollspyNav from "react-scrollspy-nav";
import FooterUpdate from "../dashboard/_footer.jsx";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const TermsOfService = (props) => {
    const { t } = useTranslation();
    return (
        <div className="w-100 ">
            <div className="container">
                <div className="row mt-5 mb-5">
                    <div className="col-md-3">
                        <ScrollspyNav
                            scrollTargetIds={[
                                "section_1",
                                "section_2",
                                "section_3"
                            ]}
                        >
                            <h6 className="mb-3">{t(props.language?.layout?.tos_heading)}</h6>
                            <ul className="list-unstyled side_list">
                                <li className="mb-3">
                                    <a className="active" href="#section_1">-{t(props.language?.layout?.tjs_heading)}</a>
                                </li>
                                <li className="mb-3">
                                    <a href="#section_2" className="text-muted">-{t(props.language?.layout?.tep_heading)}</a>
                                </li>
                                <li className="mb-3" >
                                    <a href="#section_3" className="text-muted">-{t(props.language?.layout?.tau_heading)}</a>
                                </li>
                            </ul>
                        </ScrollspyNav>
                    </div>
                    <div className=" col-md-9">
                        <div>
                            <div>
                                <div id="section_1">
                                    <h3 className="font-weight-bold pb-2">{t(props.language?.layout?.tos_heading)}</h3>
                                    <h5 className="font-weight-bold">{t(props.language?.layout?.tjs_heading)}</h5>
                                    <h6 className="font-weight-bold">1. {t(props.language?.layout?.tjs_point1)}</h6>
                                    <p>{t(props.language?.layout?.tjs_point1_info)}</p>
                                    <h6 className="font-weight-bold">2. {t(props.language?.layout?.tjs_point2)}</h6>
                                    <p>{t(props.language?.layout?.tjs_point2_info1)}</p>
                                    <p>{t(props.language?.layout?.tjs_point2_info2)}</p>
                                    <p>{t(props.language?.layout?.tjs_point2_info3)}</p>
                                    <p>{t(props.language?.layout?.tjs_point2_info4)}</p>
                                    <h6 className="font-weight-bold">3. {t(props.language?.layout?.tjs_point3)}</h6>
                                    <p>{t(props.language?.layout?.tjs_point3_info1)}</p>
                                    <p>{t(props.language?.layout?.tjs_point3_info2)}</p>
                                    <p>{t(props.language?.layout?.tjs_point3_info3)}</p>
                                    <p>{t(props.language?.layout?.tjs_point3_info4)}</p>
                                    <p>{t(props.language?.layout?.tjs_point3_info5_1)}<strong>{t(props.language?.layout?.tjs_point3_info5_2)}</strong></p>
                                    <p>{t(props.language?.layout?.tjs_point3_info6)}</p>
                                    <p>{t(props.language?.layout?.tjs_point3_info7)}</p>
                                    <p>{t(props.language?.layout?.tjs_point3_info8)}</p>
                                    <p>{t(props.language?.layout?.tjs_point3_info9)}</p>
                                    <h6 className="font-weight-bold">4. {t(props.language?.layout?.tjs_point4)}</h6>
                                    <p>{t(props.language?.layout?.tjs_point4_info1)}</p>
                                    <p>{t(props.language?.layout?.tjs_point4_info2)}</p>
                                    <p>{t(props.language?.layout?.tjs_point4_info3)}</p>
                                    <p>{t(props.language?.layout?.tjs_point4_info4)}</p>
                                    <p>{t(props.language?.layout?.tjs_point4_info5)}</p>
                                    <p>{t(props.language?.layout?.tjs_point4_info6)}</p>
                                    <p>{t(props.language?.layout?.tjs_point4_info7)}</p>
                                    <p>{t(props.language?.layout?.tjs_point4_info8)}</p>
                                    <h6 className="font-weight-bold">5. {t(props.language?.layout?.tjs_point5)}</h6>
                                    <p>{t(props.language?.layout?.tjs_point5_info1_1)}<strong>{t(props.language?.layout?.tjs_point5_info1_2)}</strong> {t(props.language?.layout?.tjs_point5_info1_3)}</p>
                                    <p>{t(props.language?.layout?.tjs_point5_info2)}</p>
                                    <p>{t(props.language?.layout?.tjs_point5_info3)}</p>
                                    <h6 className="font-weight-bold">6. {t(props.language?.layout?.tjs_point6)}</h6>
                                    <p>{t(props.language?.layout?.tjs_point6_info1)}</p>
                                    <p>{t(props.language?.layout?.tjs_point6_info2)}</p>
                                    <h6 className="font-weight-bold">7. {t(props.language?.layout?.tjs_point7)}</h6>
                                    <p>{t(props.language?.layout?.tjs_point7_info1)}</p>
                                    <p>{t(props.language?.layout?.tjs_point7_info2)}</p>
                                    <h6 className="font-weight-bold">8. {t(props.language?.layout?.tjs_point8)}</h6>
                                    <p>{t(props.language?.layout?.tjs_point8_info)}</p>
                                </div>
                                <div id="section_2">
                                    <h5 className="font-weight-bold">{t(props.language?.layout?.tep_heading)}</h5>
                                    <p>{t(props.language?.layout?.tep_heading_info)}</p>
                                    <h6 className="font-weight-bold">1. {t(props.language?.layout?.tep_point1)}</h6>
                                    <p>{t(props.language?.layout?.tep_point1_info1)}</p>
                                    <p>{t(props.language?.layout?.tep_point1_info2)}</p>
                                    <p>{t(props.language?.layout?.tep_point1_info3)}</p>
                                    <p>{t(props.language?.layout?.tep_point1_info4_1)}: {t(props.language?.layout?.tep_point1_info4)}</p>
                                    <p>{t(props.language?.layout?.tep_point1_info5)}</p>
                                    <h6 className="font-weight-bold">2. {t(props.language?.layout?.tep_point2)}</h6>
                                    <p>{t(props.language?.layout?.tep_point2_info1)}</p>
                                    <p>{t(props.language?.layout?.tep_point2_info2)}</p>
                                    <p>{t(props.language?.layout?.tep_point2_info3)}</p>
                                    <p>{t(props.language?.layout?.tep_point2_info4)}</p>
                                    <p>{t(props.language?.layout?.tep_point2_info5)}</p>
                                    <p>{t(props.language?.layout?.tep_point2_info6)}</p>
                                    <p>{t(props.language?.layout?.tep_point2_info7)}</p>
                                    <p>{t(props.language?.layout?.tep_point2_info8_1)}<strong>{t(props.language?.layout?.tep_point2_info8_2)}</strong></p>
                                    <h6 className="font-weight-bold">3. {t(props.language?.layout?.tep_point3)}</h6>
                                    <p>{t(props.language?.layout?.tep_point3_info)}</p>
                                    <h6 className="font-weight-bold">4. {t(props.language?.layout?.tep_point4)}</h6>
                                    <p>{t(props.language?.layout?.tep_point4_info)}</p>
                                    <h6 className="font-weight-bold">5. {t(props.language?.layout?.tep_point5)}</h6>
                                    <p>{t(props.language?.layout?.tep_point5_info1_1)}<strong>{t(props.language?.layout?.tep_point5_info1_2)}</strong>{t(props.language?.layout?.tep_point5_info1_3)}</p>
                                    <p>{t(props.language?.layout?.tep_point5_info2)}</p>
                                    <h6 className="font-weight-bold">6. {t(props.language?.layout?.tep_point6)}</h6>
                                    <p>{t(props.language?.layout?.tep_point6_info1)}</p>
                                    <p>{t(props.language?.layout?.tep_point6_info2)}</p>
                                    <p>{t(props.language?.layout?.tep_point6_info3)}</p>
                                    <h6 className="font-weight-bold">7. {t(props.language?.layout?.tep_point7)}</h6>
                                    <p>{t(props.language?.layout?.tep_point7_info)}</p>
                                    <h6 className="font-weight-bold">8. {t(props.language?.layout?.tep_point8)}</h6>
                                    <p>{t(props.language?.layout?.tep_point8_info)}</p>                
                                </div>
                                <div id="section_3">
                                    <h5 className="font-weight-bold">{t(props.language?.layout?.tau_heading)}</h5>
                                    <p>{t(props.language?.layout?.tau_heading_info)}</p>
                                    <h6 className="font-weight-bold">1. {t(props.language?.layout?.tau_point1)}</h6>
                                    <p>{t(props.language?.layout?.tau_point1_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point1_info2)}</p>
                                    <p>{t(props.language?.layout?.tau_point1_info3)}</p>
                                    <p>{t(props.language?.layout?.tau_point1_info4)}</p>
                                    <h6 className="font-weight-bold">2. {t(props.language?.layout?.tau_point2)}</h6>
                                    <p>{t(props.language?.layout?.tau_point2_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point2_info2_1)}<a href="https://careerconnector.simplifyhire.com/contact-us">{t(props.language?.layout?.tau_point2_info2_2)}</a>{t(props.language?.layout?.tau_point2_info2_3)}</p>
                                    <p>{t(props.language?.layout?.tau_point2_info3)}</p>
                                    <h6 className="font-weight-bold">3. {t(props.language?.layout?.tau_point3)}</h6>
                                    <p>{t(props.language?.layout?.tau_point3_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point3_info2)}</p>
                                    <p>{t(props.language?.layout?.tau_point3_info3)}</p>
                                    <p>{t(props.language?.layout?.tau_point3_info4_1)}<a href="https://careerconnector.simplifyhire.com/contact-us">{t(props.language?.layout?.tau_point3_info4_2)}</a>{t(props.language?.layout?.tau_point3_info4_3)}</p>
                                    <p>{t(props.language?.layout?.tau_point3_info5)}</p>
                                    <p>{t(props.language?.layout?.tau_point3_info6)}</p>
                                    <h6 className="font-weight-bold">4. {t(props.language?.layout?.tau_point4)}</h6>
                                    <p>{t(props.language?.layout?.tau_point4_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point4_info2)}</p>
                                    <p>{t(props.language?.layout?.tau_point4_info3_1)}:{t(props.language?.layout?.tau_point4_info3_2)}</p>
                                    <p>{t(props.language?.layout?.tau_point4_info4)}</p>
                                    <h6 className="font-weight-bold">5. {t(props.language?.layout?.tau_point5)}</h6>
                                    <p>{t(props.language?.layout?.tau_point5_info1_1)}:<br></br>{t(props.language?.layout?.tau_point5_info1_2)} :</p>
                                    <ul>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info2)} : 
                                            <ul>
                                                <li>
                                                {t(props.language?.layout?.tau_point5_info2_1)}
                                                </li>
                                                <li>
                                                {t(props.language?.layout?.tau_point5_info2_2)}
                                                </li>
                                                <li>
                                                {t(props.language?.layout?.tau_point5_info2_3)}
                                                </li>
                                                <li>
                                                {t(props.language?.layout?.tau_point5_info2_4)}
                                                </li>
                                                <li>
                                                {t(props.language?.layout?.tau_point5_info2_5)}
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info3)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info4)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info5)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info6)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info7)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info8)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info9)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info10)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info11)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info12)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info23)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info25)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info13)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info14)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info16)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info15)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info17)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info24)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info18)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info19)}
                                        </li>
                                        <li>
                                        {t(props.language?.layout?.tau_point5_info20)}
                                        </li>
                                    </ul>
                                    <p>{t(props.language?.layout?.tau_point5_info21_1)}<br></br>{t(props.language?.layout?.tau_point5_info21_2)}</p>
                                    <p>{t(props.language?.layout?.tau_point5_info22_1)}:{t(props.language?.layout?.tau_point5_info22_2)}</p>
                                    <h6 className="font-weight-bold">6. {t(props.language?.layout?.tau_point6)}</h6>
                                    <p>{t(props.language?.layout?.tau_point6_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point6_info2)}</p>
                                    <h6 className="font-weight-bold">7.{t(props.language?.layout?.tau_point7)}</h6>
                                    <p>{t(props.language?.layout?.tau_point7_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point7_info2)}</p>
                                    <p>{t(props.language?.layout?.tau_point7_info3)}</p>
                                    <p>{t(props.language?.layout?.tau_point7_info4)}</p>
                                    <h6 className="font-weight-bold">8. {t(props.language?.layout?.tau_point8)}</h6>
                                    <p>{t(props.language?.layout?.tau_point8_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point8_info2_1)}: {t(props.language?.layout?.tau_point8_info2)}</p>
                                    <h6 className="font-weight-bold">9. {t(props.language?.layout?.tau_point9)}</h6>
                                    <p>{t(props.language?.layout?.tau_point9_info1_1)}: {t(props.language?.layout?.tau_point9_info1)}</p>
                                    <h6 className="font-weight-bold">10. {t(props.language?.layout?.tau_point10)}</h6>
                                    <p>{t(props.language?.layout?.tau_point10_info)}</p>
                                    <h6 className="font-weight-bold">11. {t(props.language?.layout?.tau_point11)}</h6>
                                    <p>{t(props.language?.layout?.tau_point11_info)}</p>
                                    <h6 className="font-weight-bold">12. {t(props.language?.layout?.tau_point12)}</h6>
                                    <p>{t(props.language?.layout?.tau_point12_info)}</p>
                                    <h6 className="font-weight-bold">13. {t(props.language?.layout?.tau_point13)}</h6>
                                    <p>{t(props.language?.layout?.tau_point13_info1)}<a href="https://careerconnector.simplifyhire.com/contact-us">{t(props.language?.layout?.tau_point13_info2)}</a></p>
                                    <h6 className="font-weight-bold">14. {t(props.language?.layout?.tau_point14)}</h6>
                                    <p>{t(props.language?.layout?.tau_point14_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point14_info2_1)}<br></br>{t(props.language?.layout?.tau_point14_info2_2)}</p>
                                    <p>{t(props.language?.layout?.tau_point14_info3)}</p>
                                    <p>{t(props.language?.layout?.tau_point14_info4)}</p>
                                    <h6 className="font-weight-bold">15. {t(props.language?.layout?.tau_point15)}</h6>
                                    <p>{t(props.language?.layout?.tau_point15_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point15_info2)}<strong>{t(props.language?.layout?.tau_point15_info3)}</strong></p>
                                    <h6 className="font-weight-bold">16. {t(props.language?.layout?.tau_point16)}</h6>
                                    <p> {t(props.language?.layout?.tau_point16_info)}</p>
                                    <h6 className="font-weight-bold">17. {t(props.language?.layout?.tau_point17)}</h6>
                                    <p>{t(props.language?.layout?.tau_point17_info1)}</p>
                                    <p>{t(props.language?.layout?.tau_point17_info2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterUpdate />
        </div>
    )
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
}
}
export default connect(mapStateToProps, {})(TermsOfService);