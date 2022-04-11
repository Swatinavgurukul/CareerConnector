const path = require('path');
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '../../.env') });
const Sitemap = require("react-router-sitemap").default;
const cron = require("node-cron");
const HostUrl = process.env.HOST_URL;
// console.log("host urls -->>>>", HostUrl);
function Routes() {
    const routerList = [
        { path: "/" },
        { path: "jobs/client-project-manager-718y6x" },
        { path: "jobs/content-marketing-associate-pl3h3i" },
        { path: "jobs/product-owner-94v0hs" },
        { path: "jobs/client-project-manager" },
        { path: "/login" },
        // { path: "/demo_paginator" },
        { path: "/location/atlanta" },
        { path: "/pricing" },
        { path: "/faq" },
        // { path: "/homepage" },
        { path: "/globallocations" },
        // { path: "/approval" },
        // { path: "/rejected" },
        // { path: "/onboarding" },
        { path: "/signup" },
        { path: "/signup/candidate" },
        { path: "/about" },
        { path: "/contact-us" },
        { path: "/privacy-policy" },
        { path: "/languages" },
        { path: "/signup/nonProfitPartner" },
        { path: "/signup/corporatePartner" },
        // { path: "/verifyEmail" },
        // { path: "/approve" },
        { path: "/search" },
        { path: "/forgotPassword" },
        // { path: "/passwordResetDone" },
        // { path: "/confirmPasswordReset" },
        // { path: "/setpassword" },
        // { path: "/setpasswordpartner" },
        // { path: "/jobs/:id/applications" },
        // { path: "/jobs/edit/:id" },
        // { path: "/jobs/create" },
        // { path: "/jobs/:id" },
        // { path: "/jobs/:id/applicantlist" },
        // { path: "/simplifybot" },
        // { path: "/applications/:id" },
        // { path: "/jobSeekers/:id" },
        { path: "/dashboard" },
        { path: "/jobs" },
        // { path: "/applications" },
        // { path: "/report" },
        // { path: "/report/candidatePipeline" },
        // { path: "/report/applicationSource" },
        // { path: "/report/historicPipeline" },
        // { path: "/report/hiringVelocity" },
        // { path: "/report/successMetric" },
        // { path: "/report/timeToHire" },
        // { path: "/interview" },
        // { path: "/offers" },
        // { path: "/jobSeekers" },
        // { path: "/approvals" },
        // { path: "/getUsers" },
        // { path: "/inbox_messages" },
        // { path: "/setting" },
        // { path: "/application" },
        // { path: "/nppreport/jobseekerjournal" },
        // { path: "/nppreport/currentapplication" },
        // { path: "/nppreport/jobactivity" },
        // { path: "/nppreport/jobseekersuccessmetric" },
        // { path: "/nppreport/openjobs" },
        // { path: "/nppreport" },
        { path: "/signup" },
        { path: "/signup/employer" },
        { path: "/signup/skilling" },
        // { path: "/thankYou" },
        // { path: "/loginsso" },
        // { path: "/erd" },
        // { path: "/unauthorized" },
        // { path: "*" },
        // { path: "/404" },
    ];
    return routerList;
}
function job() {
    const jobdata = [
        { id: 1, path: "jobs/client-project-manager-718y6x" },
        { id: 2, path: "jobs/content-marketing-associate-pl3h3i" },
        { id: 3, path: "jobs/product-owner-94v0hs" },
        { id: 4, path: "jobs/client-project-manager" },
    ];
    return jobdata;
}
const generateSitemap = async (args) => {
    console.log("generateSitemap args==> ", args);
    console.log("hosturl args==> ", HostUrl);
    if (args == "sitemap") {
        var mySitemap = new Sitemap(Routes()).build(HostUrl);
    } else if (args == "jobs") {
        var mySitemap = new Sitemap(job()).build(HostUrl);
    }
    var fileName = args + ".xml";
    for (let i = 0; i < mySitemap.sitemaps[0].urls.length; i++) {
        mySitemap.sitemaps[0].urls[i].lastmod = new Date();
        mySitemap.sitemaps[0].urls[i].changefreq = "daily";
        mySitemap.sitemaps[0].urls[i].priority = 0.8;
    }
    mySitemap.save(require("path").resolve(__dirname, `../../static/${fileName}`));
    // mySitemap.save(require("path").resolve(__dirname, `../${fileName}`));
    // console.log("", require("path").resolve(__dirname));
    // mySitemap.save(fileName);
};
const run = async (arg) => {
    try {
        console.log("running scrpit...");
        await generateSitemap("sitemap");
        await generateSitemap("jobs");
    } catch (error_catch) {
        console.error("error_catch==>", error_catch);
    }
};
cron.schedule("0 */2 * * *", () => {
    console.log("running a task every 2 hours");
    run();
});
