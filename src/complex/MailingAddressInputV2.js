import React, {useState} from 'react';
import JdeServiceAdapter from '../JdeServiceAdapter';
import { DateConvertor } from '../DateConvertor';
import useGooglePlaceDetails from './useGooglePlaceDetails';
import GoogleAddressSearch from './GoogleAddressSearch';

///This is the basic version of updating the Address Book Mailing Address
const MailingAddressFormV2 = () => {
    const [ state, setState ] = useState({
        addressNumber: "",
        effectiveDate: ""
    });
    const { address, searchPlaceDetails, resetAddressSearch } = useGooglePlaceDetails();

    ///Function to modify state when an input value is modified
    const handleFieldChange = (field) => (event) => {
        setState({
            ...state,
            [field]: event.target.value
        })
    }

    const resetForm = () => {
        //Clear State
        setState({
            addressNumber: "",
            effectiveDate: ""
        });
       
    }

    ///Function that will call the JDE Orchestration to update the record
    ///Note: Only capturing the event since it is a button calling the function and we do not want to refresh the page
    const updateMailingAddress = (event) => {
        event.preventDefault();
        let requestBody = {
            addressNumber: state.addressNumber,
            effectiveDate: DateConvertor(state.effectiveDate),
            addressLine1: address.addressLine1,
            province: address.province,
            postalCode: address.postalCode,
            country: address.country
        };
        JdeServiceAdapter.orchestrationService('InFocus_Update_AddressBook_MailingAddress',requestBody)
        .then((response)=>{
            //catch generic error
            if(response.exception || response.message){
                alert(response.message);
                return;
            }
            //form specific errors
            if(response.ServiceRequest1.fs_P01012_W01012A){
                if(response.ServiceRequest1.fs_P01012_W01012A.errors && response.ServiceRequest1.fs_P01012_W01012A.errors.length > 0){
                    alert(response.ServiceRequest1.fs_P01012_W01012A.errors.join('\n'));
                    return;
                }
            }
            alert('Record Updated');
            resetForm();
        })
    }
    return (
        <React.Fragment>
            <h2 className="header">Address Book Mailing Address Update</h2>
            <form className="form">
                Address Number: <input type="number" value={state.addressNumber}    onChange={handleFieldChange('addressNumber')}/>
                Effective Date: <input type="date" value={state.effectiveDate}      onChange={handleFieldChange('effectiveDate')}/>
                <br/> <GoogleAddressSearch  searchPlaceDetails={searchPlaceDetails}/>
                Address Line 1: <input type="text" value={address.addressLine1}       disabled/>
                City:           <input type="text" value={address.city}               disabled/>
                Province:       <input type="text" value={address.province}           disabled/>
                Postal Code:    <input type="text" value={address.postalCode}         disabled/>
                Country:        <input type="text" value={address.country}            disabled /> 
               <input type="submit" value="Submit" onClick={updateMailingAddress}/>
            </form>
        </React.Fragment>
    )
}

export default MailingAddressFormV2
