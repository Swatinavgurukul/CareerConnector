export const jobsFilterData = {
    APPLIED: "applied",
    HIRED: "hired",
    INTERVIEW: "interview",
    ONHOLD: "on-hold",
    DECLINED: "declined",
    SCREENING: "screening",
    OFFERED: "offered",
    WITHDRAWN: "withdrawn",
    ACTIVE: "active",
    CLOSED: "closed",
    PAUSED: "paused",
    OFFERED: "offered",
    SOURCED: "sourced",
    OFFER: "offer",
    DRAFT: "draft",
};
export const applicationStatus = process.env.CLIENT_NAME === "cc" ? [
    "applied",
    "screening",
    "interview",
    "offered",
    "withdrawn",
    "hired",
    "declined",
    "on-hold",
    "rejected",
] :
    [
        "applied",
        "screening",
        "interview",
        "offered",
        "hired",
        "declined",
        "on-hold",
        "rejected",
    ]
export const jobStatus = ["active", "paused", "closed", "draft", "Offered"];
export const expFilter = [
    { displayValue: "0-2 Years", key: "exp0", value: [0, 2] },
    { displayValue: "2-5 Years", key: "exp2", value: [2, 5] },
    { displayValue: "5-8 Years", key: "exp5", value: [5, 8] },
    { displayValue: "> 8", key: "exp8", value: [8, 60] },
];
export const calculateScore = (data) => {
    if (data == null || data == undefined) {
        return 0;
    }
    let score =
        (data.skills + data.certification + data.education + data.job_title + data.industry + data.management_level) / 6;
    return Math.floor(score);
};
export const scoringNum = (num) => {
    let y = num % 1
    let n = y.toString();
    if (n[2] <= 5) {
        let z = Math.floor(num)
        return z;
    }
    else {
        let z = Math.ceil(num)
        return z;
    }
}
export const calculateCustomScore = (data, sovScore) => {
    if (!data || Object.keys(data).length === 0) {
        return 0;
    }
    let score =
        (
            (((scoringNum(data.Skills * 100) * scoringNum(sovScore.skills))) * 0.01)
            + (((scoringNum(data.Certifications * 100) * scoringNum(sovScore.certification))) * 0.01)
            + (((scoringNum(data.Education * 100) * scoringNum(sovScore.education))) * 0.01)
            + (((scoringNum(data.JobTitles * 100) * scoringNum(sovScore.job_title))) * 0.01)
            + (((scoringNum(data.Industries * 100) * scoringNum(sovScore.industry))) * 0.01)
            + (((scoringNum(data.ManagementLevel * 100) * scoringNum(sovScore.management_level))) * 0.01)
        );

    return scoringNum(score);
};

export const calculateJobScore = (dataDB, appliedData) => {
    if (dataDB === null) {
        return 0;
    }
    let score = {};
    let totalScore = "";
    score.certification = parseInt((((dataDB.certification * appliedData.certification) * 0.01)).toFixed(0) >= 100 ? 100 : (((dataDB.certification * appliedData.certification) * 0.01)).toFixed(0));
    score.skills = parseInt((((dataDB.skills * appliedData.skills * 0.01))).toFixed(0) >= 100 ? 100 : (((dataDB.skills * appliedData.skills * 0.01))).toFixed(0));
    score.industry = parseInt((((dataDB.industry * appliedData.industry * 0.01))).toFixed(0) >= 100 ? 100 : (((dataDB.industry * appliedData.industry * 0.01))).toFixed(0));
    score.education = parseInt((((dataDB.education * appliedData.education * 0.01))).toFixed(0) >= 100 ? 100 : (((dataDB.education * appliedData.education * 0.01))).toFixed(0));
    score.management_level = parseInt((((dataDB.management_level * appliedData.mgmtLevel * 0.01))).toFixed(0) >= 100 ? 100 : (((dataDB.management_level * appliedData.mgmtLevel * 0.01))).toFixed(0));
    score.job_title = parseInt((((dataDB.job_title * appliedData.jobTitle * 0.01))).toFixed(0) >= 100 ? 100 : (((dataDB.job_title * appliedData.jobTitle * 0.01))).toFixed(0));
    totalScore = (parseInt(score.certification) + parseInt(score.skills) + parseInt(score.industry) + parseInt(score.education) + parseInt(score.management_level) + parseInt(score.job_title));
    score.totalScore = Math.floor(totalScore);
    return score;
};
export const checkReduxPersistData = () => {
    const data = localStorage.getItem("persist:root");
    if (data) {
        return false
    }
    return true
}
export const nullHandler = (data, nullFieldToCheck) => {
    const filteredData = data.filter((item, index) => {
        if (item[nullFieldToCheck] === null || item[nullFieldToCheck] === "") {
            return false
        }
        return true
    })
    return filteredData;
}
// export const locationsData = [
//     { slug: "hyderabad", display_name: "Hyderabad", lat: 17.4126274, long: 78.267961, radius: 20 },
//     { slug: "bengaluru", display_name: "Bengaluru", lat: 12.9716, long: 77.5946, radius: 20 },
//     { slug: "gurugram", display_name: "Gurugram", lat: 28.4595, long: 77.0266, radius: 20 },
//     { slug: "newYork", display_name: "NewYork", lat: 40.7128, long: 74.0060, radius: 20 },
// ];
export const locationsData = [
    { slug: "atlanta", display_name: "Atlanta", lat: 33.749, long: 84.388, radius: 80 },
    { slug: "houston", display_name: "Houston", lat: 29.7604, long: 95.3698, radius: 80 },
];

export const UsLocations = [
    { short_code: "AL", value: "Alabama" },
    { short_code: "AK", value: "Alaska" },
    { short_code: "AS", value: "American Samoa" },
    { short_code: "AZ", value: "Arizona" },
    { short_code: "AR", value: "Arkansas" },
    { short_code: "CA", value: "California" },
    { short_code: "CO", value: "Colorad" },
    { short_code: "CT", value: "Connecticut" },
    { short_code: "DE", value: "Delaware" },
    { short_code: "DC", value: "District Of Columbia" },
    { short_code: "FM", value: "Federated States Of Micronesia" },
    { short_code: "FL", value: "Florida" },
    { short_code: "GA", value: "Georgia" },
    { short_code: "GU", value: "Guam" },
    { short_code: "HI", value: "Hawaii" },
    { short_code: "ID", value: "Idaho" },
    { short_code: "IL", value: "Illinois" },
    { short_code: "IN", value: "Indiana" },
    { short_code: "IA", value: "Iowa" },
    { short_code: "KS", value: "Kansas" },
    { short_code: "KY", value: "Kentucky" },
    { short_code: "LA", value: "Louisiana" },
    { short_code: "ME", value: "Maine" },
    { short_code: "MH", value: "Marshall Islands" },
    { short_code: "MD", value: "Maryland" },
    { short_code: "MA", value: "Massachusetts" },
    { short_code: "MI", value: "Michigan" },
    { short_code: "MN", value: "Minnesota" },
    { short_code: "MS", value: "Mississippi" },
    { short_code: "MO", value: "Missouri" },
    { short_code: "MT", value: "Montana" },
    { short_code: "NE", value: "Nebraska" },
    { short_code: "NV", value: "Nevada" },
    { short_code: "NH", value: "New Hampshire" },
    { short_code: "NJ", value: "New Jersey" },
    { short_code: "NM", value: "New Mexico" },
    { short_code: "NY", value: "New York" },
    { short_code: "NC", value: "North Carolina" },
    { short_code: "ND", value: "North Dakota" },
    { short_code: "MP", value: "Northern Mariana Islands" },
    { short_code: "OH", value: "Ohio" },
    { short_code: "OK", value: "Oklahoma" },
    { short_code: "OR", value: "Oregon" },
    { short_code: "PW", value: "Palau" },
    { short_code: "PA", value: "Pennsylvania" },
    { short_code: "PR", value: "Puerto Rico" },
    { short_code: "RI", value: "Rhode Island" },
    { short_code: "SC", value: "South Carolina" },
    { short_code: "SD", value: "South Dakota" },
    { short_code: "TN", value: "Tennessee" },
    { short_code: "TX", value: "Texas" },
    { short_code: "UT", value: "Utah" },
    { short_code: "VT", value: "Vermont" },
    { short_code: "VI", value: "Virgin Islands" },
    { short_code: "VA", value: "Virginia" },
    { short_code: "WA", value: "Washington" },
    { short_code: "WV", value: "West Virginia" },
    { short_code: "WI", value: "Wisconsin" },
    { short_code: "WY", value: "Wyoming" },
];
export const CanandaLocations = [
    {
        value: "Alberta",
        short_code: "AB"
    },
    {
        value: "British Columbia",
        short_code: "BC"
    },
    {
        value: "Manitoba",
        short_code: "MB"
    },
    {
        value: "New Brunswick",
        short_code: "NB"
    },
    {
        value: "Newfoundland and Labrador",
        short_code: "NL"
    },
    {
        value: "Northwest Territories",
        short_code: "NT"
    },
    {
        value: "Nova Scotia",
        short_code: "NS"
    },
    {
        value: "Nunavut",
        short_code: "NU"
    },
    {
        value: "Ontario",
        short_code: "ON"
    },
    {
        value: "Prince Edward Island",
        short_code: "PE"
    },
    {
        value: "Quebec",
        short_code: "QC"
    },
    {
        value: "Saskatchewan",
        short_code: "SK"
    },
    {
        value: "Yukon Territory",
        short_code: "YT"
    }
]
export const countryList = [
    { "Code": "AF", "Name": "Afghanistan" },
    { "Code": "AX", "Name": "Islands" },
    { "Code": "AL", "Name": "Albania" },
    { "Code": "DZ", "Name": "Algeria" },
    { "Code": "AS", "Name": "American Samoa" },
    { "Code": "AD", "Name": "Andorra" }, { "Code": "AO", "Name": "Angola" }, { "Code": "AI", "Name": "Anguilla" }, { "Code": "AQ", "Name": "Antarctica" }, { "Code": "AG", "Name": "Antigua and Barbuda" }, { "Code": "AR", "Name": "Argentina" }, { "Code": "AM", "Name": "Armenia" }, { "Code": "AW", "Name": "Aruba" }, { "Code": "AU", "Name": "Australia" }, { "Code": "AT", "Name": "Austria" }, { "Code": "AZ", "Name": "Azerbaijan" }, { "Code": "BS", "Name": "Bahamas" }, { "Code": "BH", "Name": "Bahrain" }, { "Code": "BD", "Name": "Bangladesh" }, { "Code": "BB", "Name": "Barbados" }, { "Code": "BY", "Name": "Belarus" }, { "Code": "BE", "Name": "Belgium" }, { "Code": "BZ", "Name": "Belize" }, { "Code": "BJ", "Name": "Benin" }, { "Code": "BM", "Name": "Bermuda" }, { "Code": "BT", "Name": "Bhutan" }, { "Code": "BO", "Name": "Bolivia, Plurinational State of" }, { "Code": "BQ", "Name": "Bonaire, Sint Eustatius and Saba" }, { "Code": "BA", "Name": "Bosnia and Herzegovina" }, { "Code": "BW", "Name": "Botswana" }, { "Code": "BV", "Name": "Bouvet Island" }, { "Code": "BR", "Name": "Brazil" }, { "Code": "IO", "Name": "British Indian Ocean Territory" }, { "Code": "BN", "Name": "Brunei Darussalam" }, { "Code": "BG", "Name": "Bulgaria" }, { "Code": "BF", "Name": "Burkina Faso" }, { "Code": "BI", "Name": "Burundi" }, { "Code": "KH", "Name": "Cambodia" }, { "Code": "CM", "Name": "Cameroon" }, { "Code": "CA", "Name": "Canada" }, { "Code": "CV", "Name": "Cape Verde" }, { "Code": "KY", "Name": "Cayman Islands" }, { "Code": "CF", "Name": "Central African Republic" }, { "Code": "TD", "Name": "Chad" }, { "Code": "CL", "Name": "Chile" }, { "Code": "CN", "Name": "China" }, { "Code": "CX", "Name": "Christmas Island" }, { "Code": "CC", "Name": "Cocos (Keeling) Islands" }, { "Code": "CO", "Name": "Colombia" }, { "Code": "KM", "Name": "Comoros" }, { "Code": "CG", "Name": "Congo" }, { "Code": "CD", "Name": "Congo, the Democratic Republic of the" }, { "Code": "CK", "Name": "Cook Islands" }, { "Code": "CR", "Name": "Costa Rica" }, { "Code": "CI", "Name": "C\u00f4te d'Ivoire" }, { "Code": "HR", "Name": "Croatia" }, { "Code": "CU", "Name": "Cuba" }, { "Code": "CW", "Name": "Cura\u00e7ao" }, { "Code": "CY", "Name": "Cyprus" }, { "Code": "CZ", "Name": "Czech Republic" }, { "Code": "DK", "Name": "Denmark" }, { "Code": "DJ", "Name": "Djibouti" }, { "Code": "DM", "Name": "Dominica" }, { "Code": "DO", "Name": "Dominican Republic" }, { "Code": "EC", "Name": "Ecuador" }, { "Code": "EG", "Name": "Egypt" }, { "Code": "SV", "Name": "El Salvador" }, { "Code": "GQ", "Name": "Equatorial Guinea" }, { "Code": "ER", "Name": "Eritrea" }, { "Code": "EE", "Name": "Estonia" }, { "Code": "ET", "Name": "Ethiopia" }, { "Code": "FK", "Name": "Falkland Islands (Malvinas)" }, { "Code": "FO", "Name": "Faroe Islands" }, { "Code": "FJ", "Name": "Fiji" }, { "Code": "FI", "Name": "Finland" }, { "Code": "FR", "Name": "France" }, { "Code": "GF", "Name": "French Guiana" }, { "Code": "PF", "Name": "French Polynesia" }, { "Code": "TF", "Name": "French Southern Territories" }, { "Code": "GA", "Name": "Gabon" }, { "Code": "GM", "Name": "Gambia" }, { "Code": "GE", "Name": "Georgia" }, { "Code": "DE", "Name": "Germany" }, { "Code": "GH", "Name": "Ghana" }, { "Code": "GI", "Name": "Gibraltar" }, { "Code": "GR", "Name": "Greece" }, { "Code": "GL", "Name": "Greenland" }, { "Code": "GD", "Name": "Grenada" }, { "Code": "GP", "Name": "Guadeloupe" }, { "Code": "GU", "Name": "Guam" }, { "Code": "GT", "Name": "Guatemala" }, { "Code": "GG", "Name": "Guernsey" }, { "Code": "GN", "Name": "Guinea" }, { "Code": "GW", "Name": "Guinea-Bissau" }, { "Code": "GY", "Name": "Guyana" }, { "Code": "HT", "Name": "Haiti" }, { "Code": "HM", "Name": "Heard Island and McDonald Islands" }, { "Code": "VA", "Name": "Holy See (Vatican City State)" }, { "Code": "HN", "Name": "Honduras" }, { "Code": "HK", "Name": "Hong Kong" }, { "Code": "HU", "Name": "Hungary" }, { "Code": "IS", "Name": "Iceland" }, { "Code": "IN", "Name": "India" }, { "Code": "ID", "Name": "Indonesia" }, { "Code": "IR", "Name": "Iran, Islamic Republic of" }, { "Code": "IQ", "Name": "Iraq" }, { "Code": "IE", "Name": "Ireland" }, { "Code": "IM", "Name": "Isle of Man" }, { "Code": "IL", "Name": "Israel" }, { "Code": "IT", "Name": "Italy" }, { "Code": "JM", "Name": "Jamaica" }, { "Code": "JP", "Name": "Japan" }, { "Code": "JE", "Name": "Jersey" }, { "Code": "JO", "Name": "Jordan" }, { "Code": "KZ", "Name": "Kazakhstan" }, { "Code": "KE", "Name": "Kenya" }, { "Code": "KI", "Name": "Kiribati" }, { "Code": "KP", "Name": "Korea, Democratic People's Republic of" }, { "Code": "KR", "Name": "Korea, Republic of" }, { "Code": "KW", "Name": "Kuwait" }, { "Code": "KG", "Name": "Kyrgyzstan" }, { "Code": "LA", "Name": "Lao People's Democratic Republic" }, { "Code": "LV", "Name": "Latvia" }, { "Code": "LB", "Name": "Lebanon" }, { "Code": "LS", "Name": "Lesotho" }, { "Code": "LR", "Name": "Liberia" }, { "Code": "LY", "Name": "Libya" }, { "Code": "LI", "Name": "Liechtenstein" }, { "Code": "LT", "Name": "Lithuania" }, { "Code": "LU", "Name": "Luxembourg" }, { "Code": "MO", "Name": "Macao" }, { "Code": "MK", "Name": "Macedonia, the Former Yugoslav Republic of" }, { "Code": "MG", "Name": "Madagascar" }, { "Code": "MW", "Name": "Malawi" }, { "Code": "MY", "Name": "Malaysia" }, { "Code": "MV", "Name": "Maldives" }, { "Code": "ML", "Name": "Mali" }, { "Code": "MT", "Name": "Malta" }, { "Code": "MH", "Name": "Marshall Islands" }, { "Code": "MQ", "Name": "Martinique" }, { "Code": "MR", "Name": "Mauritania" }, { "Code": "MU", "Name": "Mauritius" }, { "Code": "YT", "Name": "Mayotte" }, { "Code": "MX", "Name": "Mexico" }, { "Code": "FM", "Name": "Micronesia, Federated States of" }, { "Code": "MD", "Name": "Moldova, Republic of" }, { "Code": "MC", "Name": "Monaco" }, { "Code": "MN", "Name": "Mongolia" }, { "Code": "ME", "Name": "Montenegro" }, { "Code": "MS", "Name": "Montserrat" }, { "Code": "MA", "Name": "Morocco" }, { "Code": "MZ", "Name": "Mozambique" }, { "Code": "MM", "Name": "Myanmar" }, { "Code": "NA", "Name": "Namibia" }, { "Code": "NR", "Name": "Nauru" }, { "Code": "NP", "Name": "Nepal" }, { "Code": "NL", "Name": "Netherlands" }, { "Code": "NC", "Name": "New Caledonia" }, { "Code": "NZ", "Name": "New Zealand" }, { "Code": "NI", "Name": "Nicaragua" }, { "Code": "NE", "Name": "Niger" }, { "Code": "NG", "Name": "Nigeria" }, { "Code": "NU", "Name": "Niue" }, { "Code": "NF", "Name": "Norfolk Island" }, { "Code": "MP", "Name": "Northern Mariana Islands" }, { "Code": "NO", "Name": "Norway" }, { "Code": "OM", "Name": "Oman" }, { "Code": "PK", "Name": "Pakistan" }, { "Code": "PW", "Name": "Palau" }, { "Code": "PS", "Name": "Palestine, State of" }, { "Code": "PA", "Name": "Panama" }, { "Code": "PG", "Name": "Papua New Guinea" }, { "Code": "PY", "Name": "Paraguay" }, { "Code": "PE", "Name": "Peru" }, { "Code": "PH", "Name": "Philippines" }, { "Code": "PN", "Name": "Pitcairn" }, { "Code": "PL", "Name": "Poland" }, { "Code": "PT", "Name": "Portugal" }, { "Code": "PR", "Name": "Puerto Rico" }, { "Code": "QA", "Name": "Qatar" }, { "Code": "RE", "Name": "R\u00e9union" }, { "Code": "RO", "Name": "Romania" }, { "Code": "RU", "Name": "Russian Federation" }, { "Code": "RW", "Name": "Rwanda" }, { "Code": "BL", "Name": "Saint Barth\u00e9lemy" }, { "Code": "SH", "Name": "Saint Helena, Ascension and Tristan da Cunha" }, { "Code": "KN", "Name": "Saint Kitts and Nevis" }, { "Code": "LC", "Name": "Saint Lucia" }, { "Code": "MF", "Name": "Saint Martin (French part)" }, { "Code": "PM", "Name": "Saint Pierre and Miquelon" }, { "Code": "VC", "Name": "Saint Vincent and the Grenadines" }, { "Code": "WS", "Name": "Samoa" }, { "Code": "SM", "Name": "San Marino" }, { "Code": "ST", "Name": "Sao Tome and Principe" }, { "Code": "SA", "Name": "Saudi Arabia" }, { "Code": "SN", "Name": "Senegal" }, { "Code": "RS", "Name": "Serbia" }, { "Code": "SC", "Name": "Seychelles" }, { "Code": "SL", "Name": "Sierra Leone" }, { "Code": "SG", "Name": "Singapore" }, { "Code": "SX", "Name": "Sint Maarten (Dutch part)" }, { "Code": "SK", "Name": "Slovakia" }, { "Code": "SI", "Name": "Slovenia" }, { "Code": "SB", "Name": "Solomon Islands" }, { "Code": "SO", "Name": "Somalia" }, { "Code": "ZA", "Name": "South Africa" }, { "Code": "GS", "Name": "South Georgia and the South Sandwich Islands" }, { "Code": "SS", "Name": "South Sudan" }, { "Code": "ES", "Name": "Spain" }, { "Code": "LK", "Name": "Sri Lanka" }, { "Code": "SD", "Name": "Sudan" }, { "Code": "SR", "Name": "Suriname" }, { "Code": "SJ", "Name": "Svalbard and Jan Mayen" }, { "Code": "SZ", "Name": "Swaziland" }, { "Code": "SE", "Name": "Sweden" }, { "Code": "CH", "Name": "Switzerland" }, { "Code": "SY", "Name": "Syrian Arab Republic" }, { "Code": "TW", "Name": "Taiwan, Province of China" }, { "Code": "TJ", "Name": "Tajikistan" }, { "Code": "TZ", "Name": "Tanzania, United Republic of" }, { "Code": "TH", "Name": "Thailand" }, { "Code": "TL", "Name": "Timor-Leste" }, { "Code": "TG", "Name": "Togo" }, { "Code": "TK", "Name": "Tokelau" }, { "Code": "TO", "Name": "Tonga" }, { "Code": "TT", "Name": "Trinidad and Tobago" }, { "Code": "TN", "Name": "Tunisia" }, { "Code": "TR", "Name": "Turkey" }, { "Code": "TM", "Name": "Turkmenistan" }, { "Code": "TC", "Name": "Turks and Caicos Islands" }, { "Code": "TV", "Name": "Tuvalu" }, { "Code": "UG", "Name": "Uganda" }, { "Code": "UA", "Name": "Ukraine" }, { "Code": "AE", "Name": "United Arab Emirates" }, { "Code": "GB", "Name": "United Kingdom" }, { "Code": "US", "Name": "United States" }, { "Code": "UM", "Name": "United States Minor Outlying Islands" }, { "Code": "UY", "Name": "Uruguay" }, { "Code": "UZ", "Name": "Uzbekistan" }, { "Code": "VU", "Name": "Vanuatu" }, { "Code": "VE", "Name": "Venezuela, Bolivarian Republic of" }, { "Code": "VN", "Name": "Viet Nam" }, { "Code": "VG", "Name": "Virgin Islands, British" }, { "Code": "VI", "Name": "Virgin Islands, U.S." }, { "Code": "WF", "Name": "Wallis and Futuna" }, { "Code": "EH", "Name": "Western Sahara" }, { "Code": "YE", "Name": "Yemen" }, { "Code": "ZM", "Name": "Zambia" }, { "Code": "ZW", "Name": "Zimbabwe" }
]

export const Mailto = ({ email, subject, body, ...props }) => {
    return <a href={`mailto:${email}?subject=${subject || ""}&body=${body || ""}`}>{props.children}</a>;
};
