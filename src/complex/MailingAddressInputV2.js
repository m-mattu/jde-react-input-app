import React, {useState, useEffect} from 'react';
import JdeServiceAdapter from '../JdeServiceAdapter';
import { DateConvertor } from '../DateConvertor';
import PlacesAutocomplete from 'react-places-autocomplete';
import useGooglePlaceDetails from './useGooglePlaceDetails';

///This is the basic version of updating the Address Book Mailing Address
const MailingAddressFormV2 = () => {
    const [ state, setState ] = useState({
        address: "",
        errorMessage: '',
    });
    const { address, searchPlaceDetails } = useGooglePlaceDetails();
    
    useEffect(()=>{
        console.log(address);
    },[address])

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
        searchPlaceDetails(placeId);
    }

    const handleClose = () => {
        setState({
            address: '',
        })
    }

    const handleError = (status, clearSuggestions) => {
        console.log('Error from Google Maps API', status); // eslint-disable-line no-console
        setState({ errorMessage: status });
        clearSuggestions();
    }

    ///Function that will call the JDE Orchestration to update the record
    ///Note: Only capturing the event since it is a button calling the function and we do not want to refresh the page
    const updateMailingAddress = (event) => {
        event.preventDefault();
        let requestBody = state;
        requestBody.effectiveDate = DateConvertor(state.effectiveDate);
        JdeServiceAdapter.orchestrationService('InFocus_Update_AddressBook_MailingAddress',requestBody)
        .then((response)=>{
            //catch generic error
            if(response.exception || response.message){
                alert(response.message);
                return;
            }
            if(response.ServiceRequest1.fs_P01012_W01012A){
                if(response.ServiceRequest1.fs_P01012_W01012A.errors && response.ServiceRequest1.fs_P01012_W01012A.errors.length > 0){
                    alert(response.ServiceRequest1.fs_P01012_W01012A.errors.join('\n'));
                    return;
                }
            }
            alert('Record Updated');
        })
    }


    return (
        <div>
            <form 
                className="form"
            >
                Search Address: 
                    <PlacesAutocomplete
                        onChange={handleChange}
                        value={state.address}
                        onSelect={handleSelect}
                        onError={handleError}
                        shouldFetchSuggestions={state.address.length > 2}
                    >
                        {({getInputProps, getSuggestionItemProps, suggestions, loading})=>{
                            return(
                                <div className="autocomplete-root">
                                <input {...getInputProps()} />
                                <div className="autocomplete-dropdown-container">
                                  {loading && <div>Loading...</div>}
                                  {suggestions.map(suggestion => (
                                    <div {...getSuggestionItemProps(suggestion)}>
                                      <span>{suggestion.description}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                        }}
                    </PlacesAutocomplete>
                    <br/>
                    <input
                        type="submit"
                        value="Submit"
                        onClick={updateMailingAddress}/>

                    <p>Address Line 1: {address.addressLine1}</p>
                    <p>City: {address.city}</p>
                    <p>Province: {address.province}</p>
                    <p>Postal Code: {address.postalCode}</p>
                    <p>Country: {address.country}</p>
            </form>
        </div>
        
    )
}

export default MailingAddressFormV2;
