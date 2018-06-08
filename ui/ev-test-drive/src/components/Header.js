import React from 'react';
import PropTypes from 'prop-types';
import logo from '../images/logo 2.svg';

import './Header.css';

const Header = ({isVisible}) => (
  <header
    className="Header"
    style={{
      visibility: isVisible ? 'visible' : 'hidden',
      display: isVisible ? 'inherit' : 'none'
    }}
  >
    <img src={logo} className="Header-logo" alt="logo" />
    <h1 className="Header-text">Schedule a Ride</h1>
  </header>
)

Header.propTypes = {
  isVisible: PropTypes.bool.isRequired
}

export default Header;
