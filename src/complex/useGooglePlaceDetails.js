import React, { useState } from 'react'
import PropTypes from 'prop-types'

const useGooglePlaceDetails = props => {
    const API_KEY = "AIzaSyCnkSWV1FaaHP1xX6xfKbRhiqaQ9g1CJ8s";
    const [ address, setAddress ] = useState({
        streetNumber: "",
        street: "",
        city: "",
        province: "",
        province: "",
        country: "",
        addressLine1: ""
    });
    
    // const resetAddressSearch = () => {
    //     setAddress({
    //         streetNumber: "",
    //         street: "",
    //         city: "",
    //         province: "",
    //         province: "",
    //         country: "",
    //         addressLine1: ""
    //     })
    // }

    //Function to parse the place details response for the address_component field object
    const parseAddressComponent = (response) => {
        debugger;
        let addressComponents = response.result.address_components;
        let address = {};
        addressComponents.forEach((item)=>{
            if(item.types.includes('street_number'))
                address.streetNumber = item.long_name;
            if(item.types.includes('route'))
                address.street = item.long_name;
            if(item.types.includes('locality') && item.types.includes('political'))
                address.city = item.long_name;
            if(item.types.includes('administrative_area_level_1') && item.types.includes('political'))
                address.province = item.short_name;
            if(item.types.includes('postal_code'))
                address.postalCode = item.short_name;
            if(item.types.includes('country'))
                address.country = item.short_name;
        })
        address.addressLine1 = `${address.streetNumber} ${address.street}`
        return address;
    }

    const searchPlaceDetails = ({placeId}) => {
            let requestUrl = `http://172.26.26.209:8080/place/details/json?placeid=${placeId}&fields=address_component&key=${API_KEY}`;
            
            fetch(requestUrl,{
                
            })
            .then(res => res.json())
            .then((result) => {
                    let address = parseAddressComponent(result);
                    setAddress(address);
                    return;
                },
                (error) => {
                    alert(error)
                })
    }



    return {address, searchPlaceDetails, };
}

export default useGooglePlaceDetails
