import { useRef, useCallback, useEffect } from "react";

export const camelToSnake = (string) => {
    return string
        .replace(/[\w]([A-Z])/g, function (m) {
            return m[0] + "_" + m[1];
        })
        .toLowerCase();
};

export const capitalizeFirstLetter = (str) => {
    if (str) {
        let temp = str.replace(/[^a-zA-Z ]/g, " ");
        return temp.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }
};

export const truncate = (string, limit) => {
    return string == null || string === undefined
        ? ""
        : string.length > limit
        ? string.substring(0, limit - 3) + "..."
        : string;
};

export const parseDate = (string) => (isNaN(Date.parse(string)) == false ? new Date(string) : null);

const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0];
    } else {
        return navigator.userLanguage || navigator.language || navigator.browserLanguage || "en";
    }
};

export const plainText = (html) => {
    return html !== null && html !== undefined ? html.replace(/(<([^>]+)>)/gi, "") : "";
};

export const renderToLocaleDate = (string) => {
    // If date is invalid, you return ''
    // if date is valid, you return locale specific date string
    // US 02/16/2021. UK/India 16/02/2021.
    let dateCheck = parseDate(string);
    if (dateCheck !== null && dateCheck) {
        return dateCheck.toLocaleDateString(getNavigatorLanguage());
    } else {
        return "";
    }
};

export const renderDate = (string, format) => {
    // format is optional. Render to Locale
    // If date is invalid, you return ''
    // if date is valid, you return locale specific date string
    // US 02/16/2021. UK/India 16/02/2021.
};

export const renderDateInterval = (date1, date2, format) => {
    // Default of format mm/dd/yyyy.
    // date 1 is valid, date 2 is valid => January 2021 - March 2021
    // date 1 is invalid, date 2 is valid => March 2021
    // date 1 is valid, date 2 is invalid => January 2021
    // both dates are invalid => ''
};

export const removeEmpty = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
};

export const handleHttpErrors = (error) => {
    switch (error.response.status) {
        case 401:
            return "You have been Logged out due to Inactivity. Kindly refresh the page.";
        case 404:
            return "Server Error. Kindly refresh the page.";
        default:
            return "";
    }
};

export const getQueryParameters = (string) => {
    // Extracts Query String from url
    // https://url.com/asd?query=job OR https://subdomain.url.com/asd?query=job OR ?query=job OR query=job&easy_apply=true
    // All Gives same output {query : 'job'}
    if (string.length == 0) {
        return {};
    }
    let query = string.indexOf("?") === -1 ? string : string.substr(string.indexOf("?") + 1);

    let vars = query.split("&");
    let output = {};
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        output[pair[0]] = decodeURIComponent(pair[1]);
    }
    return output;
};

export const getQueryString = (query_params) => {
    let encoded = encodeURIComponent;
    return Object.keys(query_params)
        .map((k) => encoded(k) + "=" + encoded(query_params[k]))
        .join("&");
};

export const getUnixTime = (seconds) => {
    return seconds === undefined
        ? Math.floor(new Date().getTime() / 1000.0)
        : Math.floor(new Date().getTime() / 1000.0) + seconds;
};

export const useDebouncedEffect = (effect, delay, deps) => {
    const callback = useCallback(effect, deps);

    useEffect(() => {
        const handler = setTimeout(() => {
            callback();
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [callback, delay]);
};

export const useOuterClick = (callback) => {
    const callbackRef = useRef(); // initialize mutable callback ref
    const innerRef = useRef(); // returned to client, who sets the "border" element

    // update callback on each render, so second useEffect has most recent callback
    useEffect(() => {
        callbackRef.current = callback;
    });
    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
        function handleClick(e) {
            if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target)) callbackRef.current(e);
        }
    }, []); // no dependencies -> stable click listener

    return innerRef; // convenience for client (doesn't need to init ref himself)
};

// Null check for theme logo
export const isValidThemeLogo = (theme) => {
    if (theme !== undefined && theme !== "" && theme !== " " && theme !== null) {
        return true;
    } else {
        return false;
    }
};
// generate a range of colors between 2 given colors
const interpolateColor = (color1, color2, factor) => {
    // if (arguments.length < 3) {
    //     factor = 0.5;
    // }
    const result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
};
export const interpolateColors = (color1, color2, steps) => {
    const stepFactor = 1 / (steps - 1);
    const interpolatedColorArray = [];

    color1 = color1.match(/\d+/g).map(Number);
    color2 = color2.match(/\d+/g).map(Number);

    for (let i = 0; i < steps; i++) {
        interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i));
    }
    return interpolatedColorArray.reverse();
};

export const renderRange = (min, max, suffix) => {
    let output = "";
    output += min != null ? min : "";
    output += min != null && max == null ? "+" : "";
    output += min != null && max != null ? "-" : "";
    output += max != null ? max : "";
    output += suffix;
    return output;
};

export const renderCurrencyRange = (min, max, prefix) => {
    let output = "";
    output += min != null ? prefix + currencyFormat(min) : "";
    output += min != null && max == null ? "+" : "";
    output += min != null && max != null ? "-" : "";
    output += max != null ? prefix + currencyFormat(max) : "";

    return output;
};

export const currencyFormat = (number) => {
    /**
     * Number.prototype.format(n, x)
     *
     * @param integer n: length of decimal
     * @param integer x: length of sections
     */
    var n = 0;
    var x = 3;
    var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
    return number.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
};

export const resetToCapitalCasing = (text) => {
    let cleaned = text.replace("_", " ").replace("-", " ");
    return cleaned.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
