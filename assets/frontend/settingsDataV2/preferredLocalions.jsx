import React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng, geocodeByPlaceId } from "react-places-autocomplete";
import { UsLocations } from "../components/constants.jsx";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

const searchOptionsUS = {
    types: ["(cities)"],
    componentRestrictions: { country: ["us"] },
};
const searchOptionsCA = {
    types: ["(cities)"],
    componentRestrictions: { country: ["ca"] },
};
const searchOptionsBR = {
    types: ["(cities)"],
    componentRestrictions: { country: ["br"] },
};
class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: "", city: props.initialLocation || "", country: "" };
    }
    handleChange = (value) => {
        this.setState({ address: value }, () => {
            this.props.setLocationState(value);
            this.setState({ city: "" });
        });
    };
    handleChangeCountry = (value) => {
        this.setState({ country: value }, () => {
            this.props.setLocationCountry(value);
        });
    };
    handleChangeCity = (value) => {
        if (this.props.isLocation) {
            this.props.locationChange(value);
        } else {
            // try {
            //     this.props.clearLocationHander(value);
            // } catch {
            //     // console.log('props not passed')
            this.setState({ city: value });
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
        this.setState({ address: totalAddress.toString() });
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
                if (
                    adr[i].types[0] === "locality" ||
                    adr[i].types[0] === "administrative_area_level_1" ||
                    adr[i].types[0] === "country"
                ) {
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
        this.setState({ city: totalAddress.toString() });
        this.props.setLocationCity(totalAddress.toString(), totalAddress, location.latlng, location.placeId);
    };
    handleSelectCity = (address, placeId) => {

        try {
            this.props.clearLocationHander(value);
        } catch {
            // console.log('props not passed')
        }
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
                    <div className="col-md-6">
                        <div className="form-group">
                            {/* <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                                Country
                            </label> */}
                            <select className="form-control" aria-label="Location" value={this.props.country} onChange={(e) => this.handleChangeCountry(e.target.value)}>
                                <option selected="">
                                    {t(this.props.language?.layout?.employer_signup_select)}
                                </option>
                                <option value="BR" >
                                    {t(this.props.language?.layout?.globallocations_brazil)}
                                </option>
                                <option value="CA" >
                                    {t(this.props.language?.layout?.globallocations_canada)}
                                </option>
                                <option value="US">{t(this.props.language?.layout?.homepage_usa)}</option>
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
                                className={`form-group animated ${this.props.locationsJSON.country == true && this.state.country == ""
                                    ? "disabled"
                                    : ""
                                    }`}>
                                <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                                    state
                                </label>
                                <select className="form-control" onChange={(e) => this.handleChange(e.target.value)}>
                                    <option className="bg-white" selected value="">
                                        All
                                    </option>
                                    {UsLocations.map((filter) => (
                                        <option className="bg-white" key={filter.short_code} value={filter.short_code}>
                                            {filter.value}
                                        </option>
                                    ))}
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
                                : "col-md-6"
                        }>
                        <div
                            className={`form-group ${this.props.locationsJSON.country == true && (this.state.country || this.props.country) == "" ? "" : ""
                                }`}>
                            {/* {this.props.city_aligment ? null : (
                                <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                                    City
                                </label>
                            )} */}
                            <PlacesAutocomplete
                                value={this.props.isLocation ? this.props.value : this.state.city}
                                onChange={this.handleChangeCity}
                                onSelect={this.handleSelectCity}
                                searchOptions={this.state.country === "US" ? searchOptionsUS : this.state.country === "CA" ? searchOptionsCA : searchOptionsBR}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <>
                                        <input
                                            aria-label="Search"
                                            {...getInputProps({
                                                placeholder: (this.props.displayValue ? "" : t(this.props.language?.layout?.jobs_placeholder2)),
                                                className:
                                                    "form-control text-muted  h-100" +
                                                    (!this.props.city_aligment ? "rounded-0" : ""),
                                                type: "search",
                                                role: "combobox",
                                                id: "multilocation"
                                            })}
                                        />
                                        <div className={suggestions?.length == 0 ? "" : "location-autocomplete"}>
                                            {/* {loading && <div>Loading...</div>} */}
                                            {suggestions
                                                .filter((location) => location.description.includes(this.state.address))
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
        language: state.authInfo.language,
    };
}
export default connect(mapStateToProps)(withTranslation()(LocationSearchInput));
