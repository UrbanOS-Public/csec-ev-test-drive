import React from 'react';
import PropTypes from 'prop-types';

import './Footer.css';

const Footer = ({isVisible}) => (
  <footer
    className="Footer"
    style={{
      visibility: isVisible ? 'visible' : 'hidden',
      display: isVisible ? 'inherit' : 'none'
    }}
  >
    <p className="Footer-text">Footer text goes here</p>
  </footer>
);

Footer.propTypes = {
  isVisible: PropTypes.bool.isRequired
}

export default Footer;
