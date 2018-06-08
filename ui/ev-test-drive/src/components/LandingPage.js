import React from 'react';
import PropTypes from 'prop-types';
import {PAGES} from '../actions'

import topBanner from '../images/top banner.jpg';
import logo from '../images/logo 2.svg';

import './LandingPage.css';

const LandingPage = ({isActive, setVisiblePage}) => (
  <div className="LandingPage"
    style={{
      visibility: isActive ? 'visible' : 'hidden',
      display: isActive ? 'inherit' : 'none',
      backgroundImage: "url('" + topBanner + "')"
    }}
  >
    <img src={logo} className="LandingPage-logo" alt="logo" />
    <div className="LandingPage-welcomeBox">
      <h1 className="LandingPage-welcomeBox-title">
        Welcome to<br/>Smart Columbus!
      </h1>
      <div className="LandingPage-welcomeBox-subtitle">
        To get started, tap the<br/>'Schedule Your Drive' button.
      </div>
      <button className="LandingPage-welcomeBox-scheduleButton"
        onClick={() => setVisiblePage(PAGES.DRIVER_INFO)}
      >
        <div className="LandingPage-welcomeBox-scheduleButton-text">
          Schedule your drive
        </div>
      </button>
    </div>
  </div>
);

LandingPage.propTypes = {
  isActive: PropTypes.bool.isRequired,
  setVisiblePage: PropTypes.func.isRequired
}

export default LandingPage;
