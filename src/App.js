import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import FocusTrap from 'focus-trap-react';
import { useEffect, useState }  from 'react';
import './App.css';
// import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';
class App extends Component {
  constructor(props) {
    super(props);
    // this.deleteExercise = this.deleteExercise.bind(this);
    this.state = {
      journals: [], 
      journalModal: "modal-none",
      uid: "",
      title: "",
      description: "",
      userNotLoggedIn: "main-block",
      userLoggedIn: "main-none",
      full_name: "",
      myJournalsLabel: "View my journals",
    };
    this.uploadJournal = this.uploadJournal.bind(this);
    this.viewMyJournals = this.viewMyJournals.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.enter = this.enter.bind(this);
    this.viewJournalsByAuthor = this.viewJournalsByAuthor.bind(this);
  }
  componentDidMount() {
    if (this.state.uid == "") {
      this.setState({ userNotLoggedIn: "main-block", userLoggedIn: "main-none"});
    } else {
      this.setState({ userNotLoggedIn: "main-none", userLoggedIn: "main-block"});
      this.downloadJournals();
    }
  }
  downloadJournals() {
    axios.get('http://localhost:5000/journals/')
    .then(res => {
      this.setState({ journals: res.data });
    });
  }
  uploadJournal() {
    if (this.state.journalModal == "modal-none") 
      this.setState({ journalModal: "modal-block" });
    else {  
      const newJournal = {
        uid: this.state.uid,
        title: this.state.title,
        description: this.state.description,
        authorName: this.state.full_name
      };
      axios.post("http://localhost:5000/journals/add", newJournal).then(res => {
        axios.get('http://localhost:5000/journals/')
        .then(res => {
          this.setState({ journals: res.data });
          this.setState({ journalModal: "modal-none" });
          this.setState({ title: "" });
          this.setState({ description: "" });
        });
      }).catch(err => console.log(err));
    }
  }
  viewMyJournals() {
    if (this.state.myJournalsLabel == "View my journals") {
      var result = this.state.journals.filter(obj => {
        return obj.uid == this.state.uid;
      });
      this.setState({ journals: result });
      this.setState({ myJournalsLabel:"Show all journals" });
    } else {
      this.downloadJournals();
      this.setState({ myJournalsLabel:"View my journals" });
    }
  }
  viewJournalsByAuthor() {
    var result = this.state.journals.filter(obj => {
      return obj.uid == this.state.uid;
    });
    this.setState({ journals: result });
    this.setState({ journalByAuthorLabel:"Show all journals" });
  }
  onChangeTitle(e) {
    this.setState({ title: e.target.value });
  }
  onChangeDescription(e) {
    this.setState({ description: e.target.value });
  }
  onChangeName(e) {
    this.setState({ full_name: e.target.value });
  }
  enter() {
    axios.get('http://localhost:5000/users/')
    .then(res => {
      console.log(res.data)
      var result = res.data.find(obj => {
        return obj.username == this.state.full_name;
      });
      if (result != undefined) {
        this.state.uid = result["_id"];
        this.setState({ userNotLoggedIn: "main-none", userLoggedIn: "main-block"});
        this.downloadJournals();
      } else {
        var newUser = {
          username: this.state.full_name
        }; 
        axios.post('http://localhost:5000/users/add', newUser)
        .then(res => {
          this.enter();
        });
      }
    });
  }
  quit() {
    this.setState({ uid: "" });
  }
  render() {
    return (
      <div>
        <div className={this.state.userNotLoggedIn}>
            <h4>Login</h4>
            <label for="full_name">Full name: </label>
            <input name="full_name" id="full_name" onChange={this.onChangeName} value={this.state.full_name}></input>
            <br></br>
            <button onClick={this.enter}>Enter</button>
        </div>
        <div className={this.state.userLoggedIn}>
          <div className="App">
            <button onClick={this.viewMyJournals}>{this.state.myJournalsLabel}</button>
            <button onClick={this.uploadJournal}>Upload new journal</button>
          </div>
          <div className={this.state.journalModal}>
            <p>Upload New Journal</p>
            <label for="title">Title: </label>
            <input name="title" id="title" onChange={this.onChangeTitle} value={this.state.title}></input>
            <br></br>
            <label for="description">Description: </label>
            <input name="description" id="description" onChange={this.onChangeDescription} value={this.state.description}></input>
            <br></br>
            <button onClick={this.uploadJournal}>Upload</button>
          </div>
          <ul>
            {
              this.state.journals.map(journal => {
                return <li>
                  <h6>{journal.title}</h6>
                  <span onClick={this.viewJournalsByAuthor}>{journal.authorName}</span>
                  <p>{journal.description}</p>
                  <button>Watch</button>
                </li>
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
