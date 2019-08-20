import React, {useState} from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import { classnames } from '../helpers';


const GoogleAddressSearch = (props) => {
    const { searchPlaceDetails, handleClear} = props;
    const [ state, setState ] = useState({
        address: "",
        errorMessage: '',
    });

    const handleChange = address => {
        setState({
            address: address,
            errorMessage: '',
        });
    }

    const handleSelect = (selected,placeId) => {
        setState({
            address: selected,
            errorMessage: '',
        })
        searchPlaceDetails({placeId: placeId});
    }

    const handleClose = () => {
        setState({
            address: '',
        });
        handleClear();
    };

    const handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        setState({ errorMessage: status });
        clearSuggestions();
    }

    return (
            <PlacesAutocomplete
                onChange={handleChange}
                value={state.address}
                onSelect={handleSelect}
                onError={handleError}
                shouldFetchSuggestions={state.address.length > 2}
            >
                {({getInputProps, getSuggestionItemProps, suggestions, loading})=>{
                    return(
                        <div className="Demo__search-bar-container">
                            <div className="Demo__search-input-container">
                                <input
                                    {...getInputProps({
                                    placeholder: 'Search Places...',
                                    className: 'Demo__search-input',
                                    })}
                                />
                                 {state.address.length > 0 && (
                                    <button
                                    className="Demo__clear-button"
                                    onClick={handleClose}
                                    >x
                                    </button>
                                  )}
                            </div>
                             {suggestions.length > 0 && (
                            <div className="Demo__autocomplete-container">
                                {suggestions.map(suggestion => {
                                const className = classnames('Demo__suggestion-item', {
                                    'Demo__suggestion-item--active': suggestion.active,
                                });

                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, { className })}
                                    >
                                    <strong>
                                        {suggestion.formattedSuggestion.mainText}
                                    </strong>{' '}
                                    <small>
                                        {suggestion.formattedSuggestion.secondaryText}
                                    </small>
                                    </div>
                                );
                                })}
                            </div>
                    )}
                    </div>
                    )}}
            </PlacesAutocomplete>
    )
}

export default GoogleAddressSearch;