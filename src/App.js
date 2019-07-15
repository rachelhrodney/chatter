import React from 'react';
import './App.css';
import logo from './kittyLogo.png';
import TextInput from './TextInput'
import NamePicker from './namePicker.js'
import Camera from 'react-snap-pic'
import * as firebase from "firebase/app";
import "firebase/firestore"
import "firebase/storage"

class App extends React.Component {
  state = {
    messages:[],
    name:'',
    editName:false,
    showCamera:false,
  }
  
  takePicture = (img) => {
    console.log(img)
    this.setState({showCamera:false})
  }

  componentWillMount(){
    var name = localStorage.getItem('name')
    if(name){
      this.setState({name})
    }

    firebase.initializeApp({
      apiKey: "AIzaSyCiC961QMGQBO7gwpL1UmNxnpo6lZbmaUI",
      authDomain: "myawesomestproject.firebaseapp.com",
      projectId: "myawesomestproject",
      storageBucket: "myawesomestproject.appspot.com",
    });
    
    this.db = firebase.firestore();

    this.db.collection("messages").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          //console.log(change.doc.data())
          this.receive(change.doc.data())
        }
      })
    })
  }

  receive = (m) => {
    const messages = [m, ...this.state.messages]
    messages.sort((a,b)=>b.ts-a.ts)
    this.setState({messages})
  }

  send = (m) => {
    this.db.collection("messages").add({
      ...m,
      from: this.state.name || 'No name',
      ts: Date.now()
    })
  }

  setEditName = (editName) => {
    if(!editName){
      localStorage.setItem('name', this.state.name)
    }
    this.setState({editName})
  }

  render() {
    var {editName, messages, name} = this.state

    return (
      <div className="App">
      {this.state.showCamera && <Camera takePicture={this.takePicture} />}
        <header className="header">
          <div>
            <img src={logo} className="logo" alt="logo" />
            Chatter
          </div>
          <NamePicker 
            name={this.state.name}
            editName={this.state.editName}
            changeName={name=> this.setState({name})}
            setEditName={this.setEditName}
          /> 
        </header>
        <main className="messages">
          {messages.map((m,i)=>{
            return <Message key={i} m={m} name={name}/>
          })}
        </main>
        <TextInput sendMessage={text=> this.send({text})} 
          showCamera={()=>this.setState({showCamera:true})}
        />
      </div>
    )
  }
}

export default App;

function Message(props) {
  var {m, name} = props
  return(<div className="bubble-wrap" 
  from={m.from===name ? "me" : "you"}
>
    {m.from!==name && <div className="bubble-name">{m.from}</div>}
    <div className="bubble">
      <span>{m.text}</span>
    </div>
</div>)
}