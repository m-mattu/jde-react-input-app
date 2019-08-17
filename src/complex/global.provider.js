import React,{useReducer,useState} from 'react';
import GlobalContext from '../contexts/global.context';
import LoadingProvider from './loading.provider';

const GlobalProvider = ({children}) =>{
    const 
    return (
        <GlobalContext.Provider 
            value={{
                    address,
                    setAddress
                    }}>
                <LoadingProvider>
                    {children}
                </LoadingProvider>
        </GlobalContext.Provider>
    )
}

export default GlobalProvider
