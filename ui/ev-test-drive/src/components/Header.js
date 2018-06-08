import React from 'react';
import PropTypes from 'prop-types';
import logo from '../images/logo 2.svg';

import './Header.css';

const Header = () => (
  <header className="Header">
    <img src={logo} className="Header-logo" alt="logo" />
    <h1 className="Header-text">Schedule a Ride</h1>
  </header>
)

Header.propTypes = {
}

export default Header;
