import React from 'react';
import './App.css';
import logo from './kittyLogo.png';
import TextInput from './TextInput'
import NamePicker from './namePicker.js'

class App extends React.Component {
  state = {
    messages:[],
    name:'',
    editName:false,
  }

  sendMessage = (m) => {
    var messages = [...this.state.messages, m]
    this.setState({ messages })
  }

  gotMessage = (text) => {
    /*const message = {
      text: m,
      from: this.state.name
    }*/
    var newMessagesArray = [...this.state.messages, text]
    this.setState({messages: newMessagesArray})
  }

  render() {
    var {messages} = this.state
    return (
      <div className="App">
        <header className="header">
          <div>
            <img src={logo} className="logo" alt="logo" />
            Chatter
          </div>
          <NamePicker 
          name={this.state.name}
          editName={this.state.editName}
          changeName={name=> this.setState({name})}
          setEditName={editName=> this.setState({editName})}
          /> 
        </header>
        <main className="messages">
          {messages.map((m,i)=>{
            return (<div key={i} className="bubble-wrap">
              <div className="bubble">
                <span>{m}</span>
              </div>
            </div>)
          })}
        </main>
        <TextInput sendMessage={this.sendMessage} />
      </div>
    )
  }
}

export default App;
