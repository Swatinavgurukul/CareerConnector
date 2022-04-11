import React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng, geocodeByPlaceId } from "react-places-autocomplete";
import { UsLocations, CanandaLocations } from "../components/constants.jsx";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
const searchOptionsUS = {
    // types: ['(regions)'],
    types: ["(cities)"],
    componentRestrictions: { country: ["us"] },
};
const searchOptionsCA = {
    types: ["(cities)"],
    componentRestrictions: { country: ["ca"] },
};
class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: "", city: "", country: "" };
    }
    handleChange = (value) => {
        this.setState({ address: value }, () => {
            this.props.setLocationState(value);
            this.props.updateScreeningQuestions("locationCityDetails", "");
            this.props.updateScreeningQuestions("locationCity", "");
        });
    };
    handleChangeCountry = (value) => {
        this.setState({ country: value }, () => {
            this.props.setLocationCountry(value);
            this.props.updateScreeningQuestions("locationCityDetails", "");
            this.props.updateScreeningQuestions("locationCity", "");
        });
    };
    handleChangeCity = (value) => {
        if (this.props.screeningQuestions.locationEdit) {
            this.props.updateScreeningQuestions("locationCity", value);
        } else {
            this.props.updateScreeningQuestions("locationCityDetails", value);
        }
    };
    setLocation = (location) => {
        let totalAddress = [];
        let adr = location && location["address"];
        for (let i = 0; i < adr.length; i++) {
            if (adr[i].types[0] === "administrative_area_level_1") {
                totalAddress.push(adr[i].short_name);
            }
        }
        // this.setState({ address: totalAddress.toString() });
        this.props.setLocationState(totalAddress.toString());
    };
    setLocationCity = (location) => {
        let totalAddress = [];
        let adr = location && location["address"];
        if (this.props.locationsJSON.state == false && this.props.locationsJSON.country == false) {
            let adr = location && location["address"];
            for (let i = 0; i < adr.length; i++) {
                if (
                    adr[i].types[0] === "locality" ||
                    adr[i].types[0] === "administrative_area_level_1" ||
                    adr[i].types[0] === "country"
                ) {
                    totalAddress.push(adr[i].short_name);
                }
            }
        } else if (this.state.address == "") {
            let adr = location && location["address"];
            for (let i = 0; i < adr.length; i++) {
                if (adr[i].types[0] === "locality") {
                    totalAddress.push(adr[i].long_name);
                }
                if (adr[i].types[0] === "administrative_area_level_1" || adr[i].types[0] === "country") {
                    totalAddress.push(adr[i].short_name);
                }
            }
        } else {
            for (let i = 0; i < adr.length; i++) {
                if (adr[i].types[0] === "locality") {
                    totalAddress.push(adr[i].short_name);
                }
            }
        }
        this.props.updateScreeningQuestions("latitude", location["latlng"].lat);
        this.props.updateScreeningQuestions("longitude", location["latlng"].lng);
        this.props.updateScreeningQuestions("placeId", location["placeId"]);
        this.props.updateScreeningQuestions("locationCityDetails", totalAddress.toString());
        this.props.setLocationCity(totalAddress);
    };
    handleSelectCity = (address, placeId) => {
        let totalAddress = {};
        geocodeByAddress(address)
            .then((results) => {
                totalAddress["address"] = results[0].address_components;

                return getLatLng(results[0]);
            })
            .then((latLng) => {
                totalAddress["latlng"] = latLng;
            })
            .then(() => {
                totalAddress["placeId"] = placeId;
                this.setLocationCity(totalAddress);
                return geocodeByPlaceId(placeId);
            })
            .catch((error) => console.error("Error", error));
        // this.props.updateScreeningQuestions("locationCity", value);
    };
    handleSelect = (address, placeId) => {
        let totalAddress = {};
        geocodeByAddress(address)
            .then((results) => {
                totalAddress["address"] = results[0].address_components;

                return getLatLng(results[0]);
            })
            .then((latLng) => {
                totalAddress["latlng"] = latLng;
            })
            .then(() => {
                totalAddress["placeId"] = placeId;
                this.setLocation(totalAddress);
                return geocodeByPlaceId(placeId);
            })
            .catch((error) => console.error("Error", error));
    };

    render() {
        const { t } = this.props;
        return (
            <div className="row">
                {this.props.locationsJSON && this.props.locationsJSON.country ? (
                    <div className="col-md-4">
                        <div
                            className="form-group animated"
                            title="Refers to the country in which the job opening is available.">
                            <label for="location_country" className="form-label-active text-grey">
                                {t(this.props.language?.layout?.seeker_country)}*
                            </label>
                            <select
                                className="form-control"
                                id="location_country"
                                value={this.props.screeningQuestions.locationCountry}
                                onChange={(e) => this.handleChangeCountry(e.target.value)}>
                                <option selected="" className="d-none">
                                    {t(this.props.language?.layout?.seeker_select_1)}
                                </option>
                                <option value="USA">{t(this.props.language?.layout?.homepage_usa)}</option>
                                <option value="Canada">Canada +1</option>
                                <option value="Australia" disabled>
                                    {t(this.props.language?.layout?.seeker_selectoption_austalia)}
                                </option>
                                <option value="Brazil" disabled>
                                    {t(this.props.language?.layout?.seeker_selectoption_brazil)}
                                </option>
                            </select>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {this.props.locationsJSON && this.props.locationsJSON.state ? (
                    <div className="col-md-4">
                        <div>
                            <div
                                className={`form-group animated ${this.props.locationsJSON.country == true &&
                                    this.state.country == "" &&
                                    this.props.screeningQuestions.locationCountry == ""
                                    ? "disabled"
                                    : ""
                                    }`}
                                title="Refers to the state in which the job opening is available.">
                                <label for="location_state" className="form-label-active text-grey">
                                    {t(this.props.language?.layout?.jobs_state_nt)}*
                                </label>
                                <select
                                    className="form-control"
                                    id="location_state"
                                    value={this.props.screeningQuestions.locationState}
                                    onChange={(e) => this.handleChange(e.target.value)}>
                                    <option className="bg-white" selected value="">
                                        {t(this.props.language?.layout?.js_jobs_all)}
                                    </option>
                                    {this.props?.screeningQuestions?.locationCountry == "USA" ? (UsLocations.map((filter) => (
                                        <option className="bg-white" key={filter.short_code} value={filter.short_code}>
                                            {filter.value}
                                        </option>
                                    ))) : (
                                        CanandaLocations.map((filter) => (
                                            <option className="bg-white" key={filter.short_code} value={filter.short_code}>
                                                {filter.value}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {this.props.locationsJSON && this.props.locationsJSON.city ? (
                    <div
                        className={
                            this.props.locationsJSON &&
                                this.props.locationsJSON.country == false &&
                                this.props.locationsJSON.state == false &&
                                this.props.locationsJSON.city
                                ? "col-md-12"
                                : "col-md-4"
                        }>
                        <div
                            className={`form-group animated ${this.props.locationsJSON.country == true &&
                                this.state.country == "" &&
                                this.props.screeningQuestions.locationCountry == ""
                                ? "disabled"
                                : ""
                                }`}
                            title="Refers to the city in which the job opening is available.">
                            {this.props.city_aligment ? null : (
                                <label for="location_city" className="form-label-active text-grey">
                                    {t(this.props.language?.layout?.ep_setting_cd_city)}*
                                </label>
                            )}
                            <PlacesAutocomplete
                                value={
                                    this.props.screeningQuestions.locationEdit
                                        ? this.props.screeningQuestions.locationCity
                                        : this.props.screeningQuestions.locationCityDetails
                                }
                                onChange={this.handleChangeCity}
                                onSelect={this.handleSelectCity}
                                searchOptions={this.props?.screeningQuestions?.locationCountry == "USA" ? searchOptionsUS : searchOptionsCA}
                                id="location_city">
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <>
                                        <input
                                            {...getInputProps({
                                                placeholder: t(this.props.language?.layout?.ep_createjob_search),
                                                className:
                                                    "form-control text-muted  h-100 shadow-none" +
                                                    (!this.props.city_aligment ? "rounded-0" : ""),
                                            })}
                                        />
                                        <div className="location-autocomplete">
                                            {/* {loading && <div>Loading...</div>} */}
                                            {suggestions
                                                .filter((location) =>
                                                    location.description.includes(
                                                        this.props.screeningQuestions.locationState
                                                    )
                                                )
                                                .map((suggestion) => {
                                                    const className = suggestion.active
                                                        ? "suggestion-item--active"
                                                        : "suggestion-item";
                                                    const style = suggestion.active
                                                        ? {
                                                            backgroundColor: "#fafafa",
                                                            cursor: "pointer",
                                                            borderBottom: "1px solid #EAEDEC",
                                                            borderLeft: "1px solid lightgray",
                                                            borderRight: "1px solid lightgray",
                                                        }
                                                        : {
                                                            backgroundColor: "#ffffff",
                                                            cursor: "pointer",
                                                            borderBottom: "1px solid #EAEDEC",
                                                            borderLeft: "1px solid lightgray",
                                                            borderRight: "1px solid lightgray",
                                                        };
                                                    return (
                                                        <div
                                                            {...getSuggestionItemProps(suggestion, {
                                                                className,
                                                                style,
                                                            })}>
                                                            <span className="sidebar-heading">
                                                                {this.state.address == ""
                                                                    ? suggestion.description
                                                                    : suggestion.description.split(",")[0]}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </>
                                )}
                            </PlacesAutocomplete>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        user: state.authInfo.user,
        language: state.authInfo.language
    };
}
export default connect(mapStateToProps, {})(withTranslation()(LocationSearchInput));
