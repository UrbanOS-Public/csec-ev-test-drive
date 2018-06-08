import React from 'react';
import PropTypes from 'prop-types';

import topBanner from '../images/top banner.jpg';
import logo from '../images/logo 2.svg';

import './LandingPage.css';

const LandingPage = ({isActive}) => (
  <div className="LandingPage"
    style={{
      visibility: isActive ? 'visible' : 'hidden',
      display: isActive ? 'inherit' : 'none',
      backgroundImage: "url('" + topBanner + "')"
    }}
  >
    <img src={logo} className="LandingPage-logo" alt="logo" />
    Landing Page
  </div>
);

LandingPage.propTypes = {
  isActive: PropTypes.bool.isRequired
}

export default LandingPage;
