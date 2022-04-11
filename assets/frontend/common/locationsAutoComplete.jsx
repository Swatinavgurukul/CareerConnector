import React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng, geocodeByPlaceId } from "react-places-autocomplete";
const searchOptions = {
    // types: ['(regions)'],
    types: ["(cities)"],
    componentRestrictions: { country: ['us'] },
};
class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: "" };
    }
    handleChange = (address) => {
        this.setState({ address: address }, () => {
            if (address == "") {
                this.props.setSearchLocation("");
            }
        });
    };

    handleSelect = (address, placeId) => {
        this.setState({ address: address });
        geocodeByAddress(address)
            .then((results) => {
                console.log(results[0].address_components);
                let address = results[0].address_components;
                if (address && address[0] && address[0].long_name) this.props.setSearchLocation(address[0].long_name,placeId);
            })
            // .then(latLng => console.log('Success', latLng))
            .catch((error) => console.error("Error", error));
    };

    render() {
        return (
                <PlacesAutocomplete
                    value={this.state.address.split(",")[0]}
                    onChange={this.handleChange}
                    onSelect={this.handleSelect}
                    searchOptions={searchOptions}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <>
                            <input
                                {...getInputProps({
                                    placeholder: "Location",
                                    className: "form-control h-100",
                                })}
                            />
                            <div className="location-autocomplete position-absolute pr-0" style={{top: '100%'}}>
                                {/* {loading && <div>Loading...</div>} */}
                                {suggestions.map((suggestion) => {
                                    const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                                    // inline style for demonstration purpose
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
                                                {suggestion.description.split(",")[0]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </PlacesAutocomplete>
        );
    }
}
export default LocationSearchInput;
