import React from 'react';
import AppHeader from '../containers/AppHeader';
import AppFooter from '../containers/AppFooter';

import './App.css';

const App = () => (
  <div className="App">
    <AppHeader />
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
    <AppFooter />
  </div>
);

export default App;