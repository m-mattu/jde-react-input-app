import React, {useState} from 'react';
import JdeServiceAdapter from '../JdeServiceAdapter';
import { DateConvertor } from '../DateConvertor';

///This is the basic version of updating the Address Book Mailing Address
const MailingAddressForm = () => {
    const [ state, setState ] = useState({
        addressNumber: "",
        effectiveDate: "",
        addressLine1: "",
        addressLine2: "",
        province: "",
        postalCode: "",
        country: ""
    });
    const resetForm = () => {
        //Clear State
        setState({
            addressNumber: "",
            effectiveDate: "",
            addressLine1: "",
            addressLine2: "",
            province: "",
            postalCode: "",
            country: ""
        });
    }
    ///Function to modify state when an input value is modified
    const handleFieldChange = (field) => (event) => {
        setState({
            ...state,
            [field]: event.target.value
        })
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
                Address Number: <input type="number" value={state.addressNumber}    onChange={handleFieldChange('addressNumber')}/><br/>
                Effective Date: <input type="date" value={state.effectiveDate}      onChange={handleFieldChange('effectiveDate')}/><br/>
                Address Line 1: <input type="text" value={state.addressLine1}       onChange={handleFieldChange('addressLine1')}/><br/>
                Address Line 2: <input type="text" value={state.addressLine2}       onChange={handleFieldChange('addressLine2')} /><br/>
                City:           <input type="text" value={state.city}               onChange={handleFieldChange('city')}/><br/>
                Province:       <input type="text" value={state.province}           onChange={handleFieldChange('province')}/><br/>
                Postal Code:    <input type="text" value={state.postalCode}         onChange={handleFieldChange('postalCode')}/>
                Country:        <input type="text" value={state.country}            onChange={handleFieldChange('country')} /> <br/>
               <input type="submit" value="Submit" onClick={updateMailingAddress}/>
            </form>
        </React.Fragment>
    )
}

export default MailingAddressForm
