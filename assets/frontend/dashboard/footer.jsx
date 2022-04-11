// Protected File. SPoC - V Vinay Kumar
import { isValid } from "date-fns";
import React, { useEffect, useState, useRef } from "react";
import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { isValidThemeLogo } from "../modules/helpers.jsx";

const Footer = (props) => {
    const location = useLocation();
    // var temp =
    return props.visible.indexOf(location.pathname) === -1 ? (
        <>
            <div className="footer_top--sec pt-3 pb-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-9">
                            <div class="list-inline mt-2">
                                <Link to="/faq" className="text-dark list-inline-item pb-2">
                                    FAQ
                                </Link>
                                |
                                <a
                                    href="https://privacy.microsoft.com/en-gb/privacystatement"
                                    className="ml-3 text-dark list-inline-item pb-2">
                                    Microsoft Privacy Statement
                                </a>
                                |
                                <a
                                    href="https://www.microsoft.com/en-us/corporate-responsibility"
                                    className="ml-3 text-dark list-inline-item pb-2">
                                    Microsoft Corporate Social Responsibility
                                </a>
                                |
                                <a
                                    href=" https://accelerateatlanta.event.microsoft.com/"
                                    className="ml-3 text-dark list-inline-item pb-2">
                                    Accelerate Program
                                </a>
                                |
                                <a href="https://linkedin.com" className="ml-3 text-dark list-inline-item pb-2">
                                    LinkedIn
                                </a>
                                |
                                <a href="mailto:jobsnow@microsoft.com" className="ml-2 text-dark list-inline-item">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="list-inline text-right mt-2">
                                <a href="javascript:void(0)" className="text-dark text-dark list-inline-item pb-2 mr-0">
                                    EN |
                                </a>
                                <a href="javascript:void(0)" className="text-dark text-dark list-inline-item pb-2 ml-1">
                                    ESP
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer class="mainfooter">
                <div class="container">
                    <div class="row">
                        <div class="col-md-2 col-xs-12">
                            <div class="footer-pad">
                                <p>What's new</p>
                                <ul class="list-unstyled">
                                    <li>
                                        <a href="javascript:void(0)">Surface Go 2</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Surface Book 3</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Microsoft 365</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Surface Pro X</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Windows 10 apps</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-2 col-xs-12">
                            <div class="footer-pad">
                                <p>Microsoft Store</p>
                                <ul class="list-unstyled">
                                    <li>
                                        <a href="javascript:void(0)">Account profile</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Download Center</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Microsoft Store support</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Returns</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Order tracking</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Store locations</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Virtual workshops and training</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Microsoft Store Promise</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-2 col-xs-12">
                            <div class="footer-pad">
                                <p>Education</p>
                                <ul class="list-unstyled">
                                    <li>
                                        <a href="javascript:void(0)">Microsoft in education</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Office for students</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Office 365 for schools</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Deals for students & parents</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Microsoft Azure in education</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-2 col-xs-12">
                            <div class="footer-pad">
                                <p>Enterprise</p>
                                <ul class="list-unstyled">
                                    <li>
                                        <a href="javascript:void(0)">Azure</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">AppSource</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Government</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Healthcare</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Manufacturing</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Financial services</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Retail</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-2 col-xs-12">
                            <div class="footer-pad">
                                <p>Developer</p>
                                <ul class="list-unstyled">
                                    <li>
                                        <a href="javascript:void(0)">Microsoft Visual Studio</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Windows Dev Center</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Developer Network</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">TechNet</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Microsoft developer program</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Channel 9</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Office Dev Center</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Microsoft Garage</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-2 col-xs-12">
                            <div class="footer-pad">
                                <p>Company</p>
                                <ul class="list-unstyled">
                                    <li>
                                        <a href="javascript:void(0)">About Microsoft</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Company news</a>
                                    </li>
                                    <li>
                                        <a href="https://privacy.microsoft.com/en-gb/privacystatement">
                                            Privacy at Microsoft
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Investors</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Diversity and inclusion</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0)">Security</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <div className=" footer_navbar pt-3 pb-3">
                <nav class="navbar navbar-expand-lg navbar-light">
                    <div class="container">
                        <ul class="nav navbar-nav navbar-left">
                            <li>
                                <p class="text-center m-0">&copy; 2021 Simplifyworkforce inc. All rights reserved.</p>
                            </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="javascript:void(0)"> Sitemap </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"> Contact Microsoft </a>
                            </li>
                            <li>
                                <a href="https://privacy.microsoft.com/en-gb/privacystatement"> Privacy </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"> Manage cookies </a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"> Terms of use</a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"> Trade marks</a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"> Safety & eco</a>
                            </li>
                            <li>
                                <a href="javascript:void(0)"> About our ads</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    ) : (
        <></>
    );
};
export default Footer;
