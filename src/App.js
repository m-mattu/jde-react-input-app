import React from 'react';
import logo from './logo.svg';
import './App.css';
import MailingAddressForm from './simple/MailingAddressInput';
import MailingAddressFormV2 from './complex/MailingAddressInputV2';

function App() {
  return (
    <div className="App">
        <MailingAddressFormV2/>
        {/* <MailingAddressForm/> */}
    </div>
  );
}

export default App;
