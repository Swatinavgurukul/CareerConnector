import React from "react";

const HeaderUpdate = () => {
    return (
        <>
            <nav class="navbar navbar-default">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <button
                            type="button"
                            class="navbar-toggle collapsed"
                            data-toggle="collapse"
                            data-target="#navbar2">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <h3
                            // style="margin-top: 0px;padding: 10px;"
                            >
                            Microsoft Career Connector
                        </h3>
                    </div>
                    <div id="navbar2" class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <a href="#">
                                    Jobs
                                    <span>
                                        <i class="fa fa-home"></i>|
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">Login</a>
                            </li>
                            <li>
                                <a href="#">Sign Up</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};
export default HeaderUpdate;
