import React, { useEffect, useState, useRef } from "react";
import FooterUpdate from "../dashboard/_footer.jsx";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { getQueryParameters } from "../modules/helpers.jsx";


const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)
const Faq = (props) => {
    const { t } = useTranslation();
    const forSkill = useRef(null)
    const forEmp = useRef(null)
    useEffect(() => {
        var url_string = window.location.href;
        var url = new URL(url_string);
        if (url.hash == "#employers") {
            executeScrollForEmp();
            // let obj = document.getElementById("employers");
            // obj.style.marginTop = "50px";
        }
        if (url.hash == "#skillingpartner") {
            executeScrollForSkill();
            // let obj = document.getElementById("skillingpartner");
            // obj.style.marginTop = "50px";
        }
    }, [])
    // console.log("history.location.search",history.location.search);
    // let url_params = getQueryParameters(history.location.search);
    // console.log("url params",url_params);
    const executeScrollForEmp = () => scrollToRef(forEmp)
    const executeScrollForSkill = () => scrollToRef(forSkill)
    return (
        <div class="w-100">
            <div class="container-fluid px-0">
                {/* <div class="row pricing-main-content"> */}
                <div class="pricing-black-background pricing-white-section">
                    <div class="col-12 text-center pt-4">
                        <h1 class="text-white font-weight-bold page-heading pt-5 mb-4">{t(props.language?.layout?.faq_heading)}</h1>
                        <p class="text-white mb-4">{t(props.language?.layout?.faq_heading_description)}</p>
                    </div>
                    <div class="container">
                        <div class="col-12">
                            <div class="d-md-flex">
                                <div className="col-md-4 px-0">
                                    <a href="/faq#information" class="text-decoration-none text-blue">
                                        <figure class="figure w-100">
                                            <img
                                                src="/uploads/user_v1llv353bppo/jobseeker.jpg"
                                                alt="jobseeker"
                                                class="img-fluid"
                                            />
                                            <div class="mt-2 mb-0 h5">{t(props.language?.layout?.faq_geninfo)}</div>
                                        </figure>
                                    </a>
                                </div>
                                <div className="col-md-4 px-0">
                                    <a href="/faq#employers" class="text-decoration-none text-blue">
                                        <figure class="figure w-100">
                                            <img
                                                src="/uploads/user_v1llv353bppo/employee.jpg"
                                                alt="employers"
                                                class="img-fluid"
                                            />
                                            <div class="mt-2 mb-0 h5">{t(props.language?.layout?.faq_emppartners)}</div>
                                        </figure>
                                    </a>
                                </div>
                                <div className="col-md-4 px-0">
                                    <a href="/faq#skillingpartner" class="text-decoration-none text-blue">
                                        <figure class="figure w-100">
                                            <img
                                                src="/uploads/user_v1llv353bppo/nonprofit.jpg"
                                                alt="skilling partner"
                                                class="img-fluid"
                                            />
                                            <div class="mt-2 mb-0 h5">{t(props.language?.layout?.faq_skillingpartners)}</div>
                                        </figure>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container" id="information">
                    <div class="row pb-3 mb-3">
                        <div className="col-md-12">
                            <div className="text-center">
                                {/* <div className="find_path text-center"> */}
                                <h2 class="h1 mb-5">{t(props.language?.layout?.faq_geninfo_heading)}</h2>
                            </div>
                            <div className="d-md-flex">
                                <div className="col-md-6">
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q1)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a1)}
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q2)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a2)}
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q3)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a3)} <a href="https://news.microsoft.com/wp-content/uploads/prod/sites/358/2020/12/Community-Skills-Program_Grantees.pdf">{t(props.language?.layout?.faq_geninfo_a3_2para)}</a> 
                                            {t(props.language?.layout?.faq_geninfo_a3_3para)} <a href="https://docs.microsoft.com/en-us/learn/certifications/partners">{t(props.language?.layout?.faq_geninfo_a3_4para)}</a>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q4)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a4)}
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q5)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a5_1)}<a href="https://careerconnector.simplifyhire.com/">{t(props.language?.layout?.faq_geninfo_a5_2)}</a>
                                            {t(props.language?.layout?.faq_geninfo_a5_3)}<a href="">{t(props.language?.layout?.faq_geninfo_a5_4)}</a>
                                            {t(props.language?.layout?.faq_geninfo_a5_5)}
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q6)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a6_1)}<a href="https://careerconnector.simplifyhire.com/">{t(props.language?.layout?.faq_geninfo_a6_2)}</a>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q7)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a7_1)}<a href="https://careerconnector.simplifyhire.com/">{t(props.language?.layout?.faq_geninfo_a7_2)}</a>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q8)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a8_1)}<a href="https://opportunity.linkedin.com/en-us?lr=1">{t(props.language?.layout?.faq_geninfo_a8_2)}</a>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q9)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a9_1)}<a href="https://news.microsoft.com/skills/">{t(props.language?.layout?.faq_geninfo_a9_2)}</a>
                                            {t(props.language?.layout?.faq_geninfo_a9_3)}<a href="https://opportunity.linkedin.com/en-us?WT.mc_id=gsi-web-linkedIn&lr=1">{t(props.language?.layout?.faq_geninfo_a9_4)}</a>
                                            {t(props.language?.layout?.faq_geninfo_a9_5)}<a href="https://opportunity.linkedin.com/en-us?WT.mc_id=gsi-web-linkedIn&lr=1">{t(props.language?.layout?.faq_geninfo_a9_6)}</a>
                                            {t(props.language?.layout?.faq_geninfo_a9_7)}<a href="https://docs.microsoft.com/en-us/learn/">{t(props.language?.layout?.faq_geninfo_a9_8)}</a>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q10)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a10)}
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q11)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a11_1)}<a href="/pricing">{t(props.language?.layout?.faq_geninfo_a11_2)}</a>
                                            {t(props.language?.layout?.faq_geninfo_a11_3)}
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q12)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a12)}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q13)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a13)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q14)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a14_1)} <a href="https://news.microsoft.com/skills">{t(props.language?.layout?.faq_geninfo_a14_2)}</a>{t(props.language?.layout?.faq_geninfo_a14_3)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q15)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a15_1)}: {t(props.language?.layout?.faq_geninfo_a15)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q16)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a16)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q17)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a17)}
                                        </p>
                                    </div>

                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_genInfo_q18)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a18_1)}<a href="https://simplifyvms.com/">{t(props.language?.layout?.faq_geninfo_a18_2)}</a>
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q19)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a19_1)}<a href="https://careerconnector.simplifyhire.com/">{t(props.language?.layout?.faq_geninfo_a19_2)}</a>
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q20)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a20)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q21)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a21)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q22)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a22)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q23)}
                                        </div>
                                        <p class="faq-body-text">
                                            A: {t(props.language?.layout?.faq_geninfo_a23)}
                                        </p>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_geninfo_a23_2para)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_geninfo_q24)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_geninfo_a24_1)} <a href="">{t(props.language?.layout?.faq_geninfo_a24_2)}</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="faq-grey-bg"
                id="employers"
                // id={emp}
                ref={forEmp}
            >
                <div class="container">
                    <div class="row">
                        <div className="col-md-12">
                            <div className="find_path text-center mb-4">
                                <h2 class="h1 my-2 font-weight-bold">{t(props.language?.layout?.faq_emppartners_heading)}</h2>
                            </div>
                            <div class="d-md-flex">
                                <div class="col-lg-6">
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_emppartners_q1)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_emppartner_a1)}:
                                            <ul>
                                                <li>
                                                    {t(props.language?.layout?.faq_emppartner_a1_point1_1)}
                                                    <a
                                                        href="https://opportunity.linkedin.com/en-us?lr=1"
                                                        class="text-primary">
                                                        {" "}
                                                        {t(props.language?.layout?.faq_emppartner_a1_point1_2)}
                                                    </a>{" "}
                                                    {t(props.language?.layout?.faq_emppartner_a1_point1_3)}
                                                </li>
                                                <li>{t(props.language?.layout?.faq_emppartner_a1_point2)}</li>
                                                <li>
                                                    {t(props.language?.layout?.faq_emppartner_a1_point3)}
                                                </li>
                                            </ul>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_emppartner_q2)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_emppartner_a2_1)}<a href="https://simplifyvms.com/">{t(props.language?.layout?.faq_emppartner_a2_2)}</a>
                                            {t(props.language?.layout?.faq_emppartner_a2_3)}
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_emppartner_q3)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_emppartner_a3_1)}<a href="https://simplifyvms.com/">{t(props.language?.layout?.faq_emppartner_a3_2)}</a>
                                            {t(props.language?.layout?.faq_emppartner_a3_3)}<a href="https://careerconnector.simplifyhire.com/pricing">{t(props.language?.layout?.faq_emppartner_a3_4)}</a>
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_emppartner_q4)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_emppartner_a4)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_emppartner_q5)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_emppartner_a5)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_emppartner_q6)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_emppartner_a6)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_emppartner_q7)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_emppartner_a7)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="skillingpartner" ref={forSkill}>
                <div class="container">
                    <div class="row">
                        <div className="col-md-12">
                            <div className="find_path text-center">
                                <h2 class="h1 mb-4 font-weight-bold">{t(props.language?.layout?.faq_skillingpartners)}</h2>
                            </div>
                            <div class="d-md-flex">
                                <div class="col-lg-6">
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingPartners_q1)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_q1_sub)}:
                                            <ul>
                                                <li>
                                                    {t(props.language?.layout?.faq_skillingpartners_a1_point1)}
                                                </li>
                                                <li>
                                                    {t(props.language?.layout?.faq_skillingpartners_a1_point2)}
                                                </li>
                                                <li>
                                                    {t(props.language?.layout?.faq_skillingpartners_a1_point3_1)}<a href="https://opportunity.linkedin.com/skills-for-in-demand-jobs"> {t(props.language?.layout?.faq_skillingpartners_a1_point3_2)}</a>
                                                    {t(props.language?.layout?.faq_skillingpartners_a1_point3_3)} : {t(props.language?.layout?.faq_skillingpartners_a1_point3_4)}
                                                </li>
                                                <li>
                                                    {t(props.language?.layout?.faq_skillingpartners_a1_point4_1)}<a href="https://docs.microsoft.com/en-us/learn/certifications/"> {t(props.language?.layout?.faq_skillingpartners_a1_point4_2)}</a>
                                                    {t(props.language?.layout?.faq_skillingpartners_a1_point4_3)}
                                                </li>
                                                <li>
                                                    {t(props.language?.layout?.faq_skillingpartners_a1_point5)}
                                                </li>
                                            </ul>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q2)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a2_1)}<a href="https://opportunity.linkedin.com/en-us?lr=1">{t(props.language?.layout?.faq_skillingpartners_a2_2)}</a>
                                            {t(props.language?.layout?.faq_skillingpartners_a2_3)}<a href="https://www.microsoft.com/en-us/corporate-responsibility/skills-employability">{t(props.language?.layout?.faq_skillingpartners_a2_4)}</a>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q3)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a3)}
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q4)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a4_1)}<a href="https://www.aspeninstitute.org/wp-content/uploads/files/content/docs/pubs/Value%20of%20Credentials.pdf">{t(props.language?.layout?.faq_skillingpartners_a4_2)}</a>
                                            {t(props.language?.layout?.faq_skillingpartners_a4_3)}<a href="https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE2PjDI">{t(props.language?.layout?.faq_skillingpartners_a4_4)}</a>
                                        </p>
                                    </div>
                                    <div class="pr-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q5)}
                                        </div>
                                        <p class="faq-body-text mb-1">
                                            {t(props.language?.layout?.faq_skillingpartners_a5)}
                                        </p>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a5_2para)}
                                        </p>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q6)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a6)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q7)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a7)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q8)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a8_1)}<a href="https://opportunity.linkedin.com/en-us?WT.mc_id=gsi-web-linkedIn&lr=1">{t(props.language?.layout?.faq_skillingpartners_a8_2)}</a>
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q9)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a9)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q10)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a10_1)} <a href="https://blog.linkedin.com/2018/february/7/rock-your-resume-with-resume-assistant-from-linkedin-microsoft">{t(props.language?.layout?.faq_skillingpartners_a10_2)}</a>
                                            {t(props.language?.layout?.faq_skillingpartners_a10_3)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q11)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a11)}
                                        </p>
                                    </div>
                                    <div class="pl-lg-4 mb-5">
                                        <div class="font-weight-bold faq-question-text h4">
                                            {t(props.language?.layout?.faq_skillingpartners_q12)}
                                        </div>
                                        <p class="faq-body-text">
                                            {t(props.language?.layout?.faq_skillingpartners_a12)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FooterUpdate />
        </div>
    );
};
function mapStateToProps(state) {
    return {
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps)(Faq);
