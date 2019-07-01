import React from 'react';
import './App.css';
import logo from './kittyLogo.png';
import TextInput from './TextInput'

class App extends React.Component {
  state = {
    messages: []
  }

  sendMessage = (m) => {
    var messages = [...this.state.messages, m]
    this.setState({ messages })
  }

  render() {
    console.log(this.state.messages)
    return (
      <div className="App">
        <header className="header">
          <img src={logo} className="logo" alt="logo" />
          Chatter
        </header>
        <TextInput sendMessage={this.sendMessage} />

      </div>
    );
  }
}

export default App;
