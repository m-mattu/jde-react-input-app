import React from 'react';
import '../App.css';
import MailingAddressFormV2 from './components/MailingAddressInputV2';
import LoadingProvider from './providers/loading.provider';
import Spinner from './components/Spinner';

function Demo() {
  return (
    <div className="App">
        <LoadingProvider>
            <MailingAddressFormV2/>
            <Spinner/>
        </LoadingProvider>
    </div>
  );
}

export default Demo;
