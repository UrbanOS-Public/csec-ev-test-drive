import React, { Component } from 'react';
import logo from './images/logo 2.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-header-text">Schedule a Ride</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <footer className="App-footer">
          <p className="App-footer-text">Footer text goes here</p>
        </footer>
      </div>
    );
  }
}

export default App;
