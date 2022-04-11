import React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng, geocodeByPlaceId } from "react-places-autocomplete";
import { UsLocations } from "../components/constants.jsx";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

const searchOptions = {
    // types: ['(regions)'],
    types: ["(cities)"],
    componentRestrictions: { country: ["us", "ca"] },
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
            this.setState({ city: value?.replace(/[^\w\s]/gi, "") });
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
    componentDidMount() {
        document.getElementById("multilocation").removeAttribute("aria-autocomplete");
    }
    render() {
        const { t } = this.props;
        return (
            <div className="row">
                {this.props.locationsJSON && this.props.locationsJSON.country ? (
                    <div className="col-md-4">
                        <div className="form-group animated">
                            <label for="exampleFormControlSelect1" className="form-label-active text-muted">
                                Country
                            </label>
                            <select className="form-control" onChange={(e) => this.handleChangeCountry(e.target.value)}>
                                <option selected="" className="d-none">
                                    select
                                </option>
                                <option value="Australia" disabled>
                                    Australia
                                </option>
                                <option value="Brazil" disabled>
                                    Brazil
                                </option>
                                <option value="USA">USA +1</option>
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
                                : "col-md-4"
                        }>
                        <div
                            className={`form-group animated ${this.props.locationsJSON.country == true && this.state.country == "" ? "disabled" : ""
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
                                searchOptions={searchOptions}>
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
                                                role: "form",
                                                id: "multilocation",
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
