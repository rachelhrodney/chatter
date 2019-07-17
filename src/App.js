import React from 'react';
import './App.css';
import logo from './kittyLogo.png';
import TextInput from './TextInput'
import NamePicker from './namePicker.js'
import Camera from 'react-snap-pic'
import * as firebase from "firebase/app";
import "firebase/firestore"
import "firebase/storage"
import Div100vh from 'react-div-100vh'

class App extends React.Component {
  state = {
    messages: [],
    name: '',
    editName: false,
    showCamera: false,
  }

  takePicture = async (img) => {
    this.setState({ showCamera: false })
    const imgID = Math.random().toString(36).substring(7);
    var storageRef = firebase.storage().ref();
    var ref = storageRef.child(imgID + '.jpg');
    await ref.putString(img, 'data_url')
    this.send({ img: imgID })
  }

  componentWillMount() {
    var name = localStorage.getItem('name')
    if (name) {
      this.setState({ name })
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
          this.receive({
            ...change.doc.data(),
            id: change.doc.id
          })
        }
        if (change.type==='removed') {
          this.remove(change.doc.id)
        }
      })
    })
  }

  removed = (id) => {
    var msgs = [...this.state.messages]
    var messages = msgs.filter(m=> m.id!==id)
    this.setState({messages})
  }

  receive = (m) => {
    const messages = [m, ...this.state.messages]
    messages.sort((a, b) => b.ts - a.ts)
    this.setState({ messages })
  }

  send = (m) => {
    this.db.collection("messages").add({
      ...m,
      from: this.state.name || 'No name',
      ts: Date.now()
    })
  }

  setEditName = (editName) => {
    if (!editName) {
      localStorage.setItem('name', this.state.name)
    }
    this.setState({ editName })
  }

  render() {
    var { editName, messages, name } = this.state
    return (
      <Div100vh className="App">
        {this.state.showCamera && <Camera takePicture={this.takePicture} />}
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} className="logo" alt="logo" />
            {editName ? '' : 'Chatter'}
          </div>
          <NamePicker
            name={this.state.name}
            editName={this.state.editName}
            changeName={name => this.setState({ name })}
            setEditName={this.setEditName}
          />
        </header>
        <main className="messages">
          {messages.map((m, i) => {
            return <Message key={i} m={m} name={name}
              onClick={() => {
                if(name===m.from) {
                this.dp.collection('messages').doc(m.id).delete()
                }
              }}
            />
          })}
        </main>
        <TextInput sendMessage={text => this.send({ text })}
          showCamera={() => this.setState({ showCamera: true })}
        />
      </Div100vh>
    )
  } // end render
}// end app component

export default App;

const bucket = 'https://firebasestorage.googleapis.com/v0/b/myawesomestproject.appspot.com/o/'
const suffix = '.jpg?alt=media'

function Message(props) {
  var { m, name, onClick } = props
  return (<div className="bubble-wrap"
    from={m.from === name ? "me" : "you"}
    onClick={onClick}
  >
    {m.from !== name && <div className="bubble-name">{m.from}</div>}
    <div className="bubble">
      <span>{m.text}</span>
      {m.img && <img alt="pic" src={bucket + m.img + suffix} />}
    </div>
  </div>)
}