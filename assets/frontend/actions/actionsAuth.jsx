/* --- Dispatchers --- */
import Axios from "axios";
export const _setAuthData = (user, userToken, refreshToken, expires_at) => (dispatch) => {
    dispatch({ type: "set_auth_data", payload: { user, userToken, refreshToken, expires_at } });
};
export const _logout = (logout) => (dispatch) => {
    localStorage.removeItem("persist:root");
    localStorage.removeItem("access_token");
    window.location.href = "/";
    dispatch({ type: "logout", payload: { logout } });
};
export const _clearStoreOnEvent = (clearStoreOnEvent) => (dispatch) => {
    dispatch({ type: "clearStoreOnEvent", payload: { clearStoreOnEvent } });
};
export const _theme = (theme) => (dispatch) => {
    dispatch({ type: "theme", payload: { theme } });
};
export const _checkLogin = (checkLogin) => (dispatch) => {
    dispatch({ type: "checkLogin", payload: { checkLogin } });
};
export const _setDefaults = () => (dispatch) => {
    dispatch({ type: "set_defaults", payload: {} });
};
export const _languages = (language) => (dispatch) => {
    dispatch({ type: "languages", payload: { language } });
};
export const _languageName = (languageName) => (dispatch) => {
    dispatch({ type: "language_name", payload: { languageName } });
};
export const _changeCountry = (changeCountry) => (dispatch) => {
    dispatch({ type: "change_country", payload: { changeCountry } });
};
export const _billingAuth = (billing) => (dispatch) => {
    dispatch({ type: "billing_auth", payload: { billing } });
};
export const _messageCountAuth = (messageCount) => (dispatch) => {
    dispatch({ type: "messageCount_auth", payload: { messageCount } });
};
export const _compareApplicants = (compareApplicants) => (dispatch) => {
    dispatch({ type: "compare_Applicants", payload: { compareApplicants } });
};
// export const _compareApplicants = (compareApplicants) => (dispatch) => {
//     dispatch({ type: "compare_Applicants", payload: { compareApplicants } });
// };
export const _advanceSearchData = (advanceSearchData) => (dispatch) => {
    dispatch({ type: "advanceSearch_Data", payload: { advanceSearchData } });
};
export const _multiresumeToken = (multiresumeToken) => (dispatch) => {
    dispatch({ type: "multiresume_Token", payload: { multiresumeToken } });
};
export const _multiJobUploadToken = (multiJobUploadToken) => (dispatch) => {
    dispatch({ type: "multijobupload_Token", payload: { multiJobUploadToken } });
};
export const _profileImage = (profileImage) => (dispatch) => {
    dispatch({ type: "user_Image", payload: { profileImage } });
};
export const _tenantTheme = (tenantTheme) => (dispatch) => {
    dispatch({ type: "tenant_theme", payload: { tenantTheme } });
};
export const _canadaPath = (canadaPath) => (dispatch) => {
    dispatch({ type: "canada_Path", payload: { canadaPath } });
};
