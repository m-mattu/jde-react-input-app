import {createContext} from 'react'

const GlobalContext = createContext({
    setAddress: ()=>{},
    address: "",
});

export default GlobalContext
