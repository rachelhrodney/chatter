import React from 'react';
import './App.css';
import logo from './kittyLogo.png';
import TextInput from './TextInput'

function App() {
  return (
    <div className="App">
      <header className="header">
      <img src={logo} className="logo" alt="logo" />
        Chatter
        </header>
        <TextInput />
    </div>
  );
}

export default App;
